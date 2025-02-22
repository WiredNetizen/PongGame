let canvasElement = document.getElementById("divineMirror");
let ctx = canvasElement.getContext("2d");

const default_speed = 3;

let ball = {position:{x:0, y:0}, dimensions:{x:10, y:10}, direction: {x:1, y:1}, 
scalers: {x: default_speed, y: default_speed}};
ball.position = {
    x: (canvasElement.clientWidth - ball.dimensions.x) / 2,
    y: (canvasElement.clientHeight - ball.dimensions.y) / 2
} 

let paddle_left = {position:{x:0, y:0}, dimensions:{x:10, y:100}, pressed: {up: false, down: false}, name: "left"};
let paddle_right= {position:{x:0, y:0}, dimensions:{x:10, y:100}, pressed: {up: false, down: false}, name: "right"};

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

let score_board = {
    dimensions: {x:100, y:50},
    position: {x: 100, y: 0},
    score: {left: 0, right: 0},
    text: "0    0"
}

score_board.position = {
    x: (canvasElement.clientWidth / 2) - (score_board.dimensions.x / 2),
    y: score_board.dimensions.y
}

function animation()
{
    console.log(canvasElement);

    document.addEventListener(
        "keydown",
        (event) => {
          const keyName = event.key;
          if (keyName == "ArrowUp")
          {
            paddle_right.pressed.up = true;
          }
          else if (keyName == "ArrowDown")
          {
            paddle_right.pressed.down = true;
          }
          else if (keyName == "w")
          {
            paddle_left.pressed.up = true;
          }
          else if (keyName == "s")
          {
            paddle_left.pressed.down = true;
          }
        },
        false,
    );
 
    document.addEventListener(
        "keyup",
        (event) => {
          const keyName = event.key;
          if (keyName == "ArrowUp")
          {
            paddle_right.pressed.up = false;
          }
          else if (keyName == "ArrowDown")
          {
            paddle_right.pressed.down = false;
          }
          else if (keyName == "w")
          {
            paddle_left.pressed.up = false;
          }
          else if (keyName == "s")
          {
            paddle_left.pressed.down = false;
          }
        },
        false,
    );

    let Interval_Draw = window.setInterval(animateFrame, 15);
}

// We need async events

function checkBallCollisionWithBoundaries()
{
    if (box_boundaries.ball_max_x <= ball.position.x)
    {
	    ball.direction.x = -1;
        score_board.score.right += 1;
        if (ball.scalers.x > default_speed || ball.scalers.y > default_speed)
        {
            ball.scalers.x *= 0.8;
            ball.scalers.y *= 0.8;
        }
    }

    if (ball.position.x <= 0)
    {
        ball.direction.x = 1;
        score_board.score.left += 1;
        if (ball.scalers.x > default_speed || ball.scalers.y > default_speed)
        {
            ball.scalers.x *= 0.8;
            ball.scalers.y *= 0.8;
        }
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

function checkBallCollisionWithPaddle(paddle)
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

    var checkHorizontal = false;
    var checkVertical = false;

    if (paddle.name == "left")
    {
        checkHorizontal = ball.position.x <= top_right.x && ball.position.x >= top_left.x;
        if (checkHorizontal)
        {
            // console.log(`The status of our horizontal is: ${checkHorizontal}`);
        }
        
        checkVertical = ball.position.y >= bottom_left.y && ball.position.y <= top_left.y;
        if (checkVertical)
        {
            // console.log(`The status of our vertical is: ${checkVertical}`);
        }
    }
    else
    {
        checkHorizontal = ball.position.x >= (top_left.x - paddle_right.dimensions.x) 
                        && ball.position.x <= (top_right.x - paddle_right.dimensions.x);
        if (checkHorizontal)
        {
            // console.log(`The status of our horizontal is: ${checkHorizontal}`);
        }
        
        checkVertical = ball.position.y >= bottom_left.y && ball.position.y <= top_left.y;
        if (checkVertical)
        {
            // console.log(`The status of our vertical is: ${checkVertical}`);
        }
    }

    if (checkHorizontal && checkVertical)
    {
        /*
        console.log(`x = ${ball.position.x}, y = ${ball.position.y}`);
        console.log(`top left: (${top_left.x} ${top_left.y})`);
        console.log(`top right: (${top_right.x}, ${top_right.y})`);
        console.log(`bottom left: (${bottom_left.x}, ${bottom_left.y})`);
        console.log(`bottom right: (${bottom_right.x}, ${bottom_right.y})`);
        */
        if (paddle.name == "left")
        {
            ball.direction.x = 1;
        }
        else
        {
            ball.direction.x = -1;
        }
        ball_centre_y = ball.position.y + (ball.dimensions.y / 2);
        paddle_centre_y = paddle.position.y + (paddle.dimensions.y / 2);

        if (ball_centre_y > paddle_centre_y)
        {
            ball.direction.y = 1;
        }
        else
        {
            ball.direction.y = -1;
        }

        if (ball.scalers.x < 7 || ball.scalers.y < 7)
        {
            ball.scalers.x *= 1.20;
            ball.scalers.y *= 1.20;
        }
    }
}

function checkPaddleBoundaries(paddle)
{
    if (paddle.position.y < 0)
    {
        paddle.position.y = 0;
    }
    
    if (paddle.position.y > canvasElement.clientHeight - paddle.dimensions.y)
    {
        paddle.position.y = canvasElement.clientHeight - paddle.dimensions.y;
    }
}

function movePaddle(paddle)
{
    if (paddle.pressed.up)
    {
        paddle.position.y -= (3 * ball.scalers.y);
    }
    if (paddle.pressed.down)
    {
        paddle.position.y += (3 * ball.scalers.y);
    }

    checkPaddleBoundaries(paddle);
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

function animateFrame()
{
    ctx.reset();
    ball.position.x += ball.scalers.x * ball.direction.x;
    ball.position.y += ball.scalers.y * ball.direction.y;

    movePaddle(paddle_left);
    movePaddle(paddle_right);

    draw(paddle_left, "black");
    draw(paddle_right, "black");

    checkBallCollisionWithBoundaries();
    checkBallCollisionWithPaddle(paddle_left);
    checkBallCollisionWithPaddle(paddle_right);

    draw(ball, "red");

    ctx.font = "38px serif";
    score_board.text = `${score_board.score.left}   ${score_board.score.right}`;
    ctx.fillText(score_board.text, score_board.position.x, score_board.position.y);

}

animation();