const Field = {
    mine_left: 0,

    // 0: nothing, 1-8: digits, 9: mine
    field: [],

    // 0: fresh, 1: ongoing, 2: success, 3: fail
    state: 0,

    init_field: function(level, position) {
        this.field = [];
        this.mine_left = level.mine;

        // fill up cells with mines
        while (this.mine_left > 0) {
            for (let row = 0; row < level.row; row++) {
                if (this.field.length < row+1) {
                    this.field.push([]);
                }
                for (let col = 0; col < level.col; col++) {
                    let random_number = Math.random();
                    let val = 0;
                    if (random_number < 0.1 && this.mine_left > 0 && row !== position[0] && col !== position[1]) {
                        this.mine_left = this.mine_left - 1;
                        val = 9;
                    }
                    if (this.field[row].length < col+1) {
                        this.field[row].push(val);
                    } else if (this.field[row][col] !== 9 && val === 9) {
                        this.field[row][col] = 9;
                    }
                }
            }
        }

        // fill up cells with digits
        for (let row = 0; row < level.row; row++) {
            for (let col = 0; col < level.col; col++) {
                if (this.field[row][col] !== 9) {
                    let sum = 0;
                    let cells_around = get_cells_around(row, col, level.row, level.col);
                    for (let cell_cor of cells_around) {
                        if (this.field[cell_cor[0]][cell_cor[1]] === 9) {sum++;}
                    }
                    this.field[row][col] = sum;
                } else {
                }
            }
        }
    },

    create_new_field: function(level) {
        let field_node = document.querySelector(".mine-field");
        field_node.innerHTML = "";
        field_node.style.width = level.col*16 + "px";

        for (let row = 0; row < level.row; row++) {
            let row_node = document.createElement("div");
            row_node.className = "row";
            for (let col = 0; col < level.col; col++) {
                let cell_node = document.createElement("div");
                cell_node.classList = "cell cell-unknown";
                cell_node.id = "c-"+row+"-"+col;
                cell_node.setAttribute("flag", "no");
                cell_node.setAttribute("row", row+"");
                cell_node.setAttribute("col", col+"");

                cell_node.addEventListener('click',(event)=>{
                    event.preventDefault();
                    if (cell_node.classList.toString().indexOf("cell-unknown") > -1) {
                        this.click_cell(event.target, [row, col], level);
                    }
                    return false;
                });

                cell_node.addEventListener('dblclick',(event)=>{
                    event.preventDefault();
                    if (cell_node.classList.toString().indexOf("cell-solved") > -1) {
                        this.dblclick_cell(event.target, [row, col]);
                    }
                    return false;
                });

                cell_node.oncontextmenu = (event)=>{
                    event.preventDefault();
                    if (cell_node.classList.toString().indexOf("cell-unknown") > -1) {
                        this.right_click_cell(event.target);
                    }
                    return false;
                };

                row_node.appendChild(cell_node);
            }
            field_node.appendChild(row_node);
        }

        set_mine_left(level.mine);
        this.state = 0;
    },

    click_cell: function (cell_node, position, level) {
        cell_node.classList = "cell cell-solved";
        if (this.state === 0) {
            this.init_field(level, position);
            cell_node.innerHTML = cell_dict[this.field[position[0]][position[1]]];
            this.expand_cell(position, new Set());
            this.state = 1;
        } else {
            if (this.detect_fail(this.field, cell_node, position)) {
                return false;
            }
            cell_node.innerHTML = cell_dict[this.field[position[0]][position[1]]];
            this.expand_cell(position, new Set());
        }
        this.detect_win(level);
    },

    dblclick_cell: function (cell_node, position) {
        if (cell_node.nodeName === "SPAN") {
            cell_node = cell_node.parentNode;
        }
        let cells_around = get_cells_around(position[0], position[1], this.field.length, this.field[0].length);
        let cell_val = this.field[position[0]][position[1]];
        let flag_cells = [];
        let unknown_cells = [];

        for (let cell of cells_around) {
            let cell_node = document.getElementById("c-"+cell[0]+"-"+cell[1]);
            if (cell_node.getAttribute("flag") === "yes") {
                flag_cells.push(cell_node);
            } else if (cell_node.classList.toString().indexOf("cell-unknown") > -1) {
                unknown_cells.push(cell_node);
            }
        }

        if (flag_cells.length !== cell_val) {
            return false;
        }

        for (let cell of cells_around) {
            let cell_node = document.getElementById("c-"+cell[0]+"-"+cell[1]);
            if (
                cell_node.classList.toString().indexOf("cell-unknown") > -1 &&
                cell_node.getAttribute("flag") === "no" &&
                this.field[cell[0]][cell[1]] === 9
            ) {
                cell_node.click();
                return false;
            }
        }

        for (let cell of unknown_cells) {
            cell.click();
        }

        return true;
    },

    right_click_cell: function (cell_node) {
        if (cell_node.nodeName === "SPAN") {
            cell_node = cell_node.parentNode;
        }
        let mine_left = get_mine_left();
        if (cell_node.getAttribute("flag") === "no") {
            if (mine_left > 0) {
                set_mine_left(mine_left-1);
                cell_node.innerHTML = cell_dict[9];
                cell_node.setAttribute("flag", "yes");
            }
        } else if (cell_node.getAttribute("flag") === "yes"){
            cell_node.innerHTML = "";
            cell_node.setAttribute("flag", "no");
            set_mine_left(mine_left+1);
        }
    },

    expand_cell: function (position, checked) {
        checked.add(position[0] + "-" + position[1]);
        let cells_around = get_cells_around(position[0], position[1], this.field.length, this.field[0].length);
        for (let cell of cells_around) {
            let key = cell[0] + "-" + cell[1];
            if (this.field[cell[0]][cell[1]] < 9) {
                let node_ref = document.getElementById("c-"+key);
                node_ref.classList = "cell cell-solved";
                node_ref.innerHTML = cell_dict[this.field[cell[0]][cell[1]]];
                if (this.field[cell[0]][cell[1]] === 0 && !checked.has(key)) {
                    checked.add(key);
                    this.expand_cell(cell, checked);
                    // break;
                }
            }
        }
    },

    detect_fail: (field, cell_node, position)=>{
        if (field[position[0]][position[1]] === 9) {
            cell_node.innerHTML = cell_dict[10];
            cell_node.style.backgroundColor = "red";
            document.querySelector("#start-btn").innerHTML = "😭";
            timer.pause();
            let cells = document.querySelectorAll(".cell");
            for (let cell of cells) {
                let id_arr = cell.id.split("-");
                let r = parseInt(id_arr[1]);
                let c = parseInt(id_arr[2]);
                if (cell.classList.toString().indexOf("cell-unknown") > -1) {
                    if (field[r][c] < 9) {
                        cell.classList = "cell cell-solved";
                        cell.innerHTML = cell_dict[field[r][c]];
                    } else if (cell.getAttribute("flag") === "no") {
                        cell.innerHTML = cell_dict[9];
                    }
                }
            }
            return true;
        }
        return false;
    },

    detect_win: (level)=>{
        let cells = document.querySelectorAll(".cell");
        let solved = 0;
        for (let cell of cells) {
            if (cell.classList.toString().indexOf("cell-solved") > -1) {
                solved++;
            }
        }
        if (solved === level.row*level.col-level.mine) {
            document.querySelector("#start-btn").innerHTML = "🕶";
            timer.pause();
            set_mine_left(0);
            for (let cell of cells) {
                if (cell.classList.toString().indexOf("cell-unknown") > -1 && cell.getAttribute("flag") === "no") {
                    cell.innerHTML = cell_dict[9];
                }
            }
        }
    }
};
