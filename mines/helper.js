const levels = {
    easy: {row: 9, col: 9, mine: 10},
    normal: {row: 16, col: 16, mine: 40},
    hard: {row: 16, col: 30, mine: 99},
    get_curent: function () {
        return this[document.querySelector(".level-d-active").innerHTML];
    }
};

const cell_dict = [
    "",
    "<span style='color:blue'>1</span>",
    "<span style='color:green'>2</span>",
    "<span style='color:red'>3</span>",
    "<span style='color:darkblue'>4</span>",
    "<span style='color:darkred'>5</span>",
    "<span style='color:cadetblue'>6</span>",
    "<span style='color:black'>7</span>",
    "<span style='color:gray'>8</span>",
    "<span>🚩</span>",
    "<span>💣</span>",
    "<span>💥</span>",
];

// get valid cells around cell(r, c) in a field(row, col)
function get_cells_around(r, c, row, col) {
    let results = [];
    if (r-1 >= 0  && c-1 >= 0 ) {results.push([r-1, c-1]);}
    if (r-1 >= 0              ) {results.push([r-1, c  ]);}
    if (r-1 >= 0  && c+1 < col) {results.push([r-1, c+1]);}
    if (             c-1 >= 0 ) {results.push([r,   c-1]);}
    if (             c+1 < col) {results.push([r,   c+1]);}
    if (r+1 < row && c-1 >= 0 ) {results.push([r+1, c-1]);}
    if (r+1 < row             ) {results.push([r+1, c  ]);}
    if (r+1 < row && c+1 < col) {results.push([r+1, c+1]);}
    return results;
}

function set_mine_left(how_many) {
    if (how_many < 0 || how_many > 999) {
        document.getElementById("mine_left").innerHTML = "???";
        return false;
    }
    if (how_many < 100 && how_many > 9) {
        how_many = "0" + how_many;
    }
    if (how_many < 10) {
        how_many = "00" + how_many;
    }
    document.getElementById("mine_left").innerHTML = how_many;
    return true;
}
function get_mine_left() {
    return parseInt(document.getElementById("mine_left").innerHTML);
}

const timer_node = document.getElementById("timer");
const timer = {
    time_id: false,
    reset_timer: ()=>{
        if (this.time_id) {
            clearInterval(this.time_id);
            timer_node.innerHTML = "000";
        }
        this.time_id = setInterval(()=>{
            let tmp = parseInt(timer_node.innerHTML) + 1;
            if (tmp >= 999) {tmp = 999}
            timer_node.innerHTML = tmp.toString().padStart(3, "0");
        }, 1000);
    },
    pause: ()=>{
        if (this.time_id) {
            clearInterval(this.time_id);
        }
    }
};
