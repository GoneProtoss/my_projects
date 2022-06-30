const game_2048 = (selector) => {
  const game_container  = document.querySelector(selector);
  const game_board_type = 4; // Must always lt 10!
  const game_state = [];

  game_container.classList.add("game_2048");

  // init cells (UI will be made later)
  // const parent_container = game_container.parentNode;
  // const container_width  = parent_container.clientWidth;

  // const board_width_percentage = 1;
  // const cell_witdh_percentage  = 0.9;

  // const cell_width_each_percentage =
  //   (board_width_percentage - cell_witdh_percentage)/cell_rows_and_comlumns;
  const draw_game = (game_state) => {
    let new_game_html = "";
    for (let row = 0; row < game_state.length; row++) {
      new_game_html += `<div class="row">`;
      for (let col = 0; col < game_state[row].length; col++) {
        new_game_html += `<div class="cell cell_${game_state[row][col]}">${game_state[row][col]}</div>`;
      }
      new_game_html += `</div>`;
    }
    game_container.innerHTML = new_game_html;
  }


  const check_board_full = () => {
    for (let row = 0; row < game_board_type; row++) {
      for (let col = 0; col < game_board_type; col++) {
        if (game_state[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  }


  const gen_new_cell = (value) => {
    if (check_board_full()) {
      alert("No more cell for you to use ...");
      return false;
    }
    let ratio = game_board_type/10;
    let row = 0;
    let col = 0;
    do {
      row = Math.floor(Math.random()*10*ratio);
      col = Math.floor(Math.random()*10*ratio);
    } while (game_state[row][col] > 0)
    game_state[row][col] = value;
  };


  const event_binding = () => {
    document.querySelector('body').addEventListener("keyup", (e) => {
      let direction_map = {
        "ArrowLeft":  "left",
        "ArrowRight": "right",
        "ArrowUp":    "up",
        "ArrowDown":  "down"
      };
      if (direction_map.hasOwnProperty(e.code)) {
        go(direction_map[e.code]);
      }
    });
  };
  

  const init_game = () => {
    for (let row = 0; row < game_board_type; row++) {
      let tmp_row = [];
      for (let col = 0; col < game_board_type; col++) {
        tmp_row.push(0);
      }
      game_state.push(tmp_row);
    }
    gen_new_cell(2);
    gen_new_cell(2);
    draw_game(game_state);
    event_binding();
  };
  

  const magic = (arr) => {
    let length = arr.length;
    let non_zero = [];
    // 先把非零推到右边
    for (let i = 0; i < length; i++) {
      if (arr[i] > 0) {
        non_zero.push(arr[i]);
      }
    }
    // 再进行相加
    let result_arr = [];
    for (let i = non_zero.length - 1; i > -1; i--) {
      if (i-1 > -1 && non_zero[i] === non_zero[i-1]) {
        result_arr.unshift(non_zero[i]+non_zero[i-1]);
        i--;
      } else {
        result_arr.unshift(non_zero[i]);
      }
    }
    // 加完再补零
    let how_many_zero_needed = length - result_arr.length;
    for (let i = 0; i < how_many_zero_needed; i++) {
      result_arr.unshift(0);
    }
    return result_arr;
  };


  // main logic
  const go = (direction) => {
    if (direction === "up") {
      for (let col = 0; col < game_board_type; col++) {
        let before = [];
        for (let row = game_board_type - 1; row > -1; row--) {
          before.push(game_state[row][col]);
        }
        let after = magic(before).reverse();
        for (let row = game_board_type - 1; row > -1; row--) {
          game_state[row][col] = after[row];
        }
      }
    }
    if (direction === "down") {
      for (let col = 0; col < game_board_type; col++) {
        let before = [];
        for (let row = 0; row < game_board_type; row++) {
          before.push(game_state[row][col]);
        }
        let after = magic(before);
        for (let row = 0; row < game_board_type; row++) {
          game_state[row][col] = after[row];
        }
      }
    }
    if (direction === "left") {
      for (let row = 0; row < game_board_type; row++) {
        let before = [];
        for (let col = game_board_type - 1; col > -1; col--) {
          before.push(game_state[row][col]);
        }
        let after = magic(before).reverse();
        for (let col = game_board_type - 1; col > -1; col--) {
          game_state[row][col] = after[col];
        }
      }
    }
    if (direction === "right") {
      for (let row = 0; row < game_board_type; row++) {
        let before = [];
        for (let col = 0; col < game_board_type; col++) {
          before.push(game_state[row][col]);
        }
        let after = magic(before);
        for (let col = 0; col < game_board_type; col++) {
          game_state[row][col] = after[col];
        }
      }
    }

    gen_new_cell(2);
    draw_game(game_state);
  }
  

  // init game
  init_game();
};