let canvasElement = document.getElementById("divineMirror");
let ctx = canvasElement.getContext("2d");

let ball = {position:{x:0, y:0}, dimensions:{x:10, y:10}, direction: {x:1, y:1}};
ball.position = {
    x: (canvasElement.clientWidth - ball.dimensions.x) / 2,
    y: (canvasElement.clientHeight - ball.dimensions.y) / 2
}

let paddle_left = {position:{x:0, y:0}, dimensions:{x:10, y:100}, direction: 1};
let paddle_right= {position:{x:0, y:0}, dimensions:{x:10, y:100}, direction: 1};

paddle_left.position = {
    x: paddle_left.dimensions.x,
    y: (canvasElement.clientHeight - paddle_left.dimensions.y) / 2
}

paddle_right.position = {
    x: canvasElement.clientWidth - (paddle_right.dimensions.x * 2),
    y: (canvasElement.clientHeight - paddle_right.dimensions.y) / 2
}

let box_boundaries = {
    ball_max_y: canvasElement.clientHeight - ball.dimensions.y,
    ball_max_x: canvasElement.clientWidth - ball.dimensions.x
}

function animation()
{
    console.log(canvasElement);
    let increment_x = 3;
    let increment_y = 3;
    let Interval_Inputs = window.setInterval(checkMovePaddlesEvent, 30);
    let Interval_Draw = window.setInterval(animateFrame, 30, increment_x, increment_y);
}

// We need async events

function checkBallCollisionWithBoundaries()
{
    if (ball.position.x > box_boundaries.ball_max_x)
    {
	    ball.direction.x *= -1;
    }

    if (ball.position.x < 0)
    {
        ball.direction.x *= -1;
    }

    if (ball.position.y > box_boundaries.ball_max_y)
    {
        ball.direction.y *= -1;
    }

    if (ball.position.y < 0)
    {
        ball.direction.y *= -1;
    }
}

function checkBallCollisionWithLeftPaddle(paddle)
{
    // Four coordinates
    let top_left = {x: paddle.position.x, y: paddle.position.y + paddle.dimensions.y};

    let top_right = {
        x: paddle.position.x + paddle.dimensions.x, 
        y: paddle.position.y + paddle_left.dimensions.y
    };

    let bottom_left = {x: paddle.position.x, y: paddle.position.y};

    let bottom_right = {
        x: paddle.position.x + paddle.dimensions.x, 
        y: paddle.position.y
    };

    var checkHorizontal = ball.position.x <= top_right.x && ball.position.x >= top_left.x;
    if (checkHorizontal)
    {
        // console.log(`The status of our horizontal is: ${checkHorizontal}`);
    }
    
    var checkVertical = ball.position.y >= bottom_left.y && ball.position.y <= top_left.y;
    if (checkVertical)
    {
        // console.log(`The status of our vertical is: ${checkVertical}`);
    }

    if (checkHorizontal && checkVertical)
    {
        console.log(`x = ${ball.position.x}, y = ${ball.position.y}`);
        console.log(`top left: (${top_left.x} ${top_left.y})`);
        console.log(`top right: (${top_right.x}, ${top_right.y})`);
        console.log(`bottom left: (${bottom_left.x}, ${bottom_left.y})`);
        console.log(`bottom right: (${bottom_right.x}, ${bottom_right.y})`);
        ball.direction.x *= -1;
        ball.direction.y *= -1;
    }
}

function checkBallCollisionWithRightPaddle(paddle)
{
    // Four coordinates
    let top_left = {x: paddle.position.x, y: paddle.position.y + paddle.dimensions.y};

    let top_right = {
        x: paddle.position.x + paddle.dimensions.x, 
        y: paddle.position.y + paddle_left.dimensions.y
    };

    let bottom_left = {x: paddle.position.x, y: paddle.position.y};

    let bottom_right = {
        x: paddle.position.x + paddle.dimensions.x, 
        y: paddle.position.y
    };

    var checkHorizontal = ball.position.x >= (top_left.x - paddle_right.dimensions.x) 
                        && ball.position.x <= (top_right.x - paddle_right.dimensions.x);
    if (checkHorizontal)
    {
        // console.log(`The status of our horizontal is: ${checkHorizontal}`);
    }
    
    var checkVertical = ball.position.y >= bottom_left.y && ball.position.y <= top_left.y;
    if (checkVertical)
    {
        //console.log(`The status of our vertical is: ${checkVertical}`);
    }

    if (checkHorizontal && checkVertical)
    {
        console.log(`x = ${ball.position.x}, y = ${ball.position.y}`);
        console.log(`top left: (${top_left.x} ${top_left.y})`);
        console.log(`top right: (${top_right.x}, ${top_right.y})`);
        console.log(`bottom left: (${bottom_left.x}, ${bottom_left.y})`);
        console.log(`bottom right: (${bottom_right.x}, ${bottom_right.y})`);
        ball.direction.x *= -1;
        ball.direction.y *= -1;
    }
}

function draw(object, colour)
{
    ctx.fillStyle = colour;
    
    ctx.fillRect(
        object.position.x,
        object.position.y,
        object.dimensions.x,
        object.dimensions.y
    );
}

function checkMovePaddlesEvent()
{
    document.addEventListener(
        "keyup",
        (event) => {
          const keyName = event.key;
          if (keyName == "ArrowUp")
          {
            paddle_right.position.y -= 1;
            console.log(paddle_right.position.y);
          }
          else if (keyName == "ArrowDown")
          {
            paddle_right.position.y += 1;
            console.log(paddle_right.position.y);
          }
          else if (keyName == "w")
          {
            paddle_left.position.y -= 1;
            console.log(paddle_left.position.y);
          }
          else if (keyName == "s")
          {
            paddle_left.position.y += 1;
            console.log(paddle_left.position.y);
          }
        },
        false,
    );
}

function animateFrame(increment_x, increment_y)
{
    ctx.reset();
    ball.position.x += increment_x * ball.direction.x;
    ball.position.y += increment_y * ball.direction.y;

    checkBallCollisionWithBoundaries();
    checkBallCollisionWithLeftPaddle(paddle_left);
    checkBallCollisionWithRightPaddle(paddle_right);

    draw(ball, "red");
    draw(paddle_left, "black");
    draw(paddle_right, "black");
}

animation();