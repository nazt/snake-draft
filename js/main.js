remove_flag = true
var speed = 5  ;

var GLOBAL_SETTINGS = {
    width: 450,
    height: 450,
    MAX_ROW: 20,
    MAX_COL: 20,
}


var get_cw = function (settings) {
    return settings.width / settings.MAX_ROW
}


var direction_mngr = new DirectionManager();

var DRAWER = DrawerManager.get_drawer(GLOBAL_SETTINGS);





function getCursorPosition(e) {
    var gCanvasElement = get_prepared_canvas();

    var kBoardWidth = GLOBAL_SETTINGS.width;
    var kBoardHeight= GLOBAL_SETTINGS.height;

    var kPieceWidth = get_cw(GLOBAL_SETTINGS);
    var kPieceHeight= get_cw(GLOBAL_SETTINGS);
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    var row = Math.floor(y / kPieceWidth);
    var column = Math.floor(x / kPieceHeight);
    var cell = new Cell(row, column);
    return cell;
}

$(document).ready(function () {

    var width = GLOBAL_SETTINGS.width;
    var height = GLOBAL_SETTINGS.height;

    var canvas = get_prepared_canvas();
    ctx = canvas.getContext("2d");
    canvas = DRAWER.draw_grid(canvas)

    //Lets save the cell width in a variable for easy control
    var COL = GLOBAL_SETTINGS.MAX_COL;
    var ROW = COL;
    var cw = get_cw(GLOBAL_SETTINGS);


    window.snake = [];
    window.foods = [];
    snake[0] = new Cell(0, 1)
    snake[1] = new Cell(0, 2)
    snake[2] = new Cell(0, 3)
    snake[3] = new Cell(0, 4)

    foods = [new Cell(4, 5), new Cell(6, 6)]

    draw = function draw(argument) {
        var head = snake[0];

        foods.forEach(function(c, k) {
          if (c.row == head.row && c.column == head.column) {
            snake.push(foods[k]);
            var cell = new Cell(Math.round(Math.random()*100 % ROW), Math.round(Math.random()*100 % ROW))
            foods[k] = cell;
            speed++;
            if(typeof game_loop != "undefined")  clearInterval(game_loop);
            game_loop = setInterval(draw, 1000/speed);
          }

        });


        // remove tail

        var tail = snake.pop();

        DRAWER.paint_cell(canvas, {row: tail.row, column: tail.column, color: 'white'});

        tail.mutate({row: head.row, column: head.column})

        var heading = direction_mngr.get_heading_direction_string();
        var current_snake_direction = direction_mngr.get_heading_direction_string();

        snake_action[current_snake_direction](tail);

        tail.correct_cell();

        snake.unshift(tail);


        draw_squares(foods, { canvas: canvas, color: 'red'})
        draw_squares(snake, { canvas: canvas, color: 'blue'})


    }

    if(typeof game_loop != "undefined")  clearInterval(game_loop);
    game_loop = setInterval(draw, 1000/speed);


    window.remove_cell = function (x, y) {
        DRAWER.paint_cell(canvas, {row: x, column:  y, color: "white"});
    }


    $canvas = $('#canvas');

    $canvas.click(function (e) {
        var cell = getCursorPosition(e);
        var options = { row: cell.row, column: cell.column, color: 'green'};
        DRAWER.paint_cell(canvas, options)
    })

    // $canvas.mousemove(function (e) {
    //     var cell = getCursorPosition(e);
    //     var options = { row: cell.row, column: cell.column};
    //     if (remove_flag == true) {
    //         options.color = 'white'
    //         DRAWER.paint_cell(canvas, options)
    //     }
    //     else {
    //         options.color = 'red'
    //         DRAWER.paint_cell(canvas, options)
    //     }
    // })


    $('body').on('keypress', function (e) {
        direction_mngr.set_heading_direction(e.charCode);
    })

})
