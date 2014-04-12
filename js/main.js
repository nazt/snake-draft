remove_flag = true
var speed = 20  ;
var direction = {
    UP: 107,
    DOWN: 106,
    LEFT: 104,
    RIGHT: 108
}

var GLOBAL_SETTINGS = {
    width: 800,
    height: 800,
    MAX_ROW: 200,
    MAX_COL: 200,
}

var get_cw = function (settings) {
    return settings.width / settings.MAX_ROW
}

var heading = direction.DOWN;

function Cell(row, column) {
  this.row = row;
  this.column = column;
}

$(document).ready(function () {

    var width = GLOBAL_SETTINGS.width;
    var height = GLOBAL_SETTINGS.height;

    var canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = GLOBAL_SETTINGS.width;
    canvas.height = GLOBAL_SETTINGS.height;

    canvas = DRAWER.drawGrid(canvas)

    //Lets save the cell width in a variable for easy control
    var COL = GLOBAL_SETTINGS.MAX_COL;
    var ROW = COL;
    var cw = get_cw(GLOBAL_SETTINGS);

    var kBoardWidth = width;
    var kBoardHeight= height;
    var kPieceWidth = cw;
    var kPieceHeight= cw;


    window.snake = [];
    window.food = [];
    snake[0] = new Cell(0, 1)
    snake[1] = new Cell(0, 2)
    snake[2] = new Cell(0, 3)
    snake[3] = new Cell(0, 4)

    foods = [new Cell(5,5), new Cell(6, 6)]

    draw = function draw(argument) {
        var head = snake[0];

        var x_h = head.row
        var y_h = head.column

        if (x_h > COL) {
            x_h = 0;
        }

        if (y_h > ROW) {
            y_h = 0;
        }


        foods.forEach(function(c, k) {
          if (c.row == head.row && c.column == head.column) {
            snake.push(foods[k]);
            var cell = new Cell(Math.round(Math.random()*100 % ROW), Math.round(Math.random()*100 % ROW))
            foods[k] = cell;
          }

        });


        // remove tail

        var pc = snake.pop();
        DRAWER.paint_cell(canvas, {row: pc.row, column: pc.column, color: 'white'});

        pc.row = head.row
        pc.column = head.column

        if (heading == direction.DOWN) {
            pc.row++;
        }
        else if (heading == direction.UP) {
            pc.row--;
            if (pc.row < 0) {
                pc.row = ROW-1
            }
        }
        else if (heading == direction.LEFT) {
            pc.column--;
            if (pc.column < 0) {
                pc.column = COL-1
            }
        }
        else if (heading == direction.RIGHT) {
            pc.column++;
        }

        pc.row = pc.row % ROW
        pc.column = pc.column % COL
        snake.unshift(pc);

        snake.forEach(function (c, k) {
            var options = {row: pc.row, column: pc.column, color: 'blue'}
            DRAWER.paint_cell(canvas, options)
        })


        foods.forEach(function(c, k) {
          var options = {row: c.row, column: c.column, color: 'red'}
          DRAWER.paint_cell(canvas, options);
        })


    }
    if(typeof game_loop != "undefined")  clearInterval(game_loop);
    game_loop = setInterval(draw, 1000/speed);

    //drawGrid(ctx, width, height, cw);


    window.remove_cell = function (x, y) {
        DRAWER.paint_cell(canvas, {row: x, column:  y, color: "white"});
    }


    $canvas = $('#canvas');

    $canvas.click(function (e) {
        var cell = getCursorPosition(e);
        var options = { row: cell.row, column: cell.column };
        DRAWER.paint_cell(canvas, options)
        remove_flag = !remove_flag;
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
        switch(e.charCode) {
            //h
            // left
            case direction.LEFT:
                if (heading != direction.RIGHT) {
                    heading = direction.LEFT;
                }
                break;
            //j
            //down
            case direction.DOWN:
                if (heading != direction.UP) {
                    heading = direction.DOWN;
                }
                break;
            //k
            //up
            case direction.UP:
                if (heading != direction.DOWN) {
                    heading = direction.UP;
                }
                break;
            //l
            //right
            case direction.RIGHT:
                if (heading != direction.LEFT) {
                    heading = direction.RIGHT;
                }
                break;
        }
    })
    function getCursorPosition(e) {
      var gCanvasElement = $canvas[0];
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

})


var DRAWER = (function (GLOBAL_SETTINGS) {
    function drawGrid(canvas, options) {
        options = jQuery.extend(GLOBAL_SETTINGS, options)
        var width = options.width || 300;
        var height = options.height || 300;
        var row = options.MAX_ROW|| 10;
        var col = options.MAX_COL || 10;
        var cw = get_cw(options);
        var gridColor = options.color || "#eee";

        var ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        // verical
        for (var x = 0.5; x < width; x += cw) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }

        // horizontal
        for (var y = 0.5; y < height; y += cw) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }

        ctx.strokeStyle = gridColor;
        ctx.stroke();

        return canvas;
    }


    //Lets first create a generic function to paint cells
    var paint_cell = function(canvas, options) {
        options = jQuery.extend(GLOBAL_SETTINGS, options)
        var width = options.width || 300;
        var height = options.height || 300;
        var color = options.color || 'blue';

        var row = options.row || options.x || 0 ;
        var col = options.column || options.y || 0;
        var column = col;

        var cw = width/options.MAX_ROW;
        var gridColor = options.color || "#eee";
        var ctx = canvas.getContext("2d");

        jQuery.extend(ctx, { fillStyle: color || "black" })

        settings = {
              fillRect: [column * cw, row * cw, cw, cw],
            strokeRect: [column * cw, row* cw, cw, cw]
        }

        jQuery.each(settings, function(k, v) {
             ctx[k].apply(ctx, v);
        })

        console.log(row, column)
        return new Cell(row, column);

    }
    return {
        drawGrid: drawGrid,
        paint_cell: paint_cell 
    }
})(GLOBAL_SETTINGS)
