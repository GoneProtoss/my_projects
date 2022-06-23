const game_snake = (selector) => {
  const game_container  = document.querySelector(selector);
  const game_field_rows = 20;
  const game_field_cols = 30;
  const game_state_empty = 0;
  const game_state_snake = 1;
  const game_state_food  = 2;
  const game_state  = [];
  let the_snake     = [];
  let cur_direction = '';
  let game_loop_timer = null;
  let game_loop_level = 500;

  game_container.classList.add("game_snake");

  const draw_game = () => {
    let new_game_html = "";
    for (let row = 0; row < game_state.length; row++) {
      new_game_html += `<div class="row">`;
      for (let col = 0; col < game_state[row].length; col++) {
        new_game_html += `<div id="cell_${row}_${col}" class="cell cell_${game_state[row][col]}"></div>`;
      }
      new_game_html += `</div>`;
    }
    game_container.innerHTML = new_game_html;
  }
  const set_cell = (pos, type) => {
    let cell = document.querySelector(`#cell_${pos[0]}_${pos[1]}`);
    cell.classList = '';
    cell.classList.add('cell');
    cell.classList.add(`cell_${type}`);
  }

  const sync_snake_state = () => {
    for (let i = 0; i < the_snake.length; i++) {
      let row = the_snake[i][0];
      let col = the_snake[i][1];
      game_state[row][col] = game_state_snake;
    }
  };

  const check_field_full = () => {
    for (let row = 0; row < game_field_rows; row++) {
      for (let col = 0; col < game_field_cols; col++) {
        if (game_state[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  }

  const gen_food = () => {
    if (check_field_full()) {
      alert("No more space for new food generation ...");
      return false;
    }
    let row_ratio = game_field_rows/10;
    let col_ratio = game_field_cols/10;
    let row = 0;
    let col = 0;
    do {
      row = Math.floor(Math.random()*10*row_ratio);
      col = Math.floor(Math.random()*10*col_ratio);
    } while (game_state[row][col] > 0)
    game_state[row][col] = game_state_food;
    set_cell([row, col], game_state_food);
  };

  const get_head = () => { return the_snake[the_snake.length-1] };
  const get_second = () => { return the_snake[the_snake.length-2] };
  const second_of_head = () => { // 第二节在头部的哪个方向
    let head = get_head();
    let second = get_second();

    // 横向
    if (second[0] === head[0] && second[1] < head[1]) {
      return 'left'; // 蛇向右，第二节在蛇头左边
    }
    if (second[0] === head[0] && second[1] > head[1]) {
      return 'right'; // 蛇向左，第二节在蛇头右边
    }
    // 纵向
    if (second[1] === head[1] && second[0] < head[0]) {
      return 'up'; // 蛇向下，第二节在蛇头上面
    }
    if (second[1] === head[1] && second[0] > head[0]) {
      return 'down'; // 蛇向上，第二节在蛇头下面
    }
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
        // 如果方向为自己的身体则不理会当前指定方向
        if (second_of_head() !== direction_map[e.code]) {
          cur_direction = direction_map[e.code];
        }
      }
    });
  };

  const get_next_pos = () => {
    let head = get_head();
    let next_pos = [];
    if (cur_direction === 'left')  {
      next_pos = [head[0], head[1] - 1];
    }
    if (cur_direction === 'right') {
      next_pos = [head[0], head[1] + 1];
    }
    if (cur_direction === 'up')    {
      next_pos = [head[0] - 1, head[1]];
    }
    if (cur_direction === 'down')  {
      next_pos = [head[0] + 1, head[1]];
    }
    if (  // 撞墙
      next_pos[0] < 0 || next_pos[0] >= game_field_rows ||
      next_pos[1] < 0 || next_pos[1] >= game_field_cols
    ) {
      return false;
    }
    if ( // 撞自己
      game_state[next_pos[0]][next_pos[1]] === game_state_snake
    ) {
      return false;
    }
    return next_pos;
  };

  const start_game = () => {
    game_loop_timer = setInterval(()=>{
      // 判断蛇是否能继续按当前指定方向前进
      let next_pos = get_next_pos();
      // 不能，撞墙/撞自己, 否则游戏结束
      if (next_pos === false) {
        stop_game();
        alert('Game Over.');
        return false;
      }
      // 能
      if (
        game_state[next_pos[0]][next_pos[1]] === game_state_food
      ) {
        // 前方存在食物
        game_state[next_pos[0]][next_pos[1]] = game_state_snake;
        the_snake.push(next_pos);
        set_cell(next_pos, game_state_snake);
        gen_food();
      } else {
        // 前方没有食物
        the_snake.push(next_pos);
        let the_tail = the_snake.shift();
        game_state[next_pos[0]][next_pos[1]] = game_state_snake;
        game_state[the_tail[0]][the_tail[1]] = game_state_empty;
        set_cell(next_pos, game_state_snake);
        set_cell(the_tail, game_state_empty);
      }
    }, game_loop_level);
  };

  const stop_game  = () => {
    clearInterval(game_loop_timer);
  };

  const init_game = () => {
    for (let row = 0; row < game_field_rows; row++) {
      let tmp_row = [];
      for (let col = 0; col < game_field_cols; col++) {
        tmp_row.push(game_state_empty);
      }
      game_state.push(tmp_row);
    }
    the_snake = [[0,0],[0,1],[0,2]];
    cur_direction = 'right';
    sync_snake_state();
    draw_game();
    gen_food();
    event_binding();
    start_game();
  };

  init_game();
};