const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext('2d')
const gameRatio = canvas.width * 0.25 /(50); // (x/y) change x into a purcentage, 1 is standard
//0.00625
// 400 100 = 1

var ateApple = false;
var running = true;
var defeat = false;

window.onload = () => {
    
    gameLoop()
}

function gameLoop() {
    
    
    setInterval(show, 1000/12) // here 15 is our fps value
    window.addEventListener("keydown", (event) => {
        if(event.keyCode == 32){
            running = !running          
        }
    })
}

function show() {
    if(running == true)
    {
      update()
      draw()  
    }
    
}

function update() {
    ateApple = false;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    snake.move()
    eatApple()
    checkHitWall()
}

function eatApple() {
    if(snake.tail[snake.tail.length - 1].x == apple.x &&
        snake.tail[snake.tail.length - 1].y == apple.y){
            snake.tail[snake.tail.length] = {x:apple.x, y: apple.y}
            ateApple = true;
            apple = new Apple();
        }
}

function checkHitWall() {
    let headTail = snake.tail[snake.tail.length - 1]

    if (headTail.x == - snake.size) {
        headTail.x = canvas.width - snake.size
    } else if (headTail.x == canvas.width) {
        headTail.x = 0
    } else if (headTail.y == - snake.size) {
        headTail.y = canvas.height - snake.size
    } else if (headTail.y == canvas.height) {
        headTail.y = 0 
    }

    for(var i = snake.tail.length - 2; i > 0; i--)
    {
        if(headTail.x == snake.tail[i].x && headTail.y == snake.tail[i].y)
        {
            if(ateApple == false)
            {
               console.log("lose") 
               defeat = true;
            }
            
            
        }
        console.log("update")
    }
}

function draw() {

    createRect(0,0,canvas.width, canvas.height, "black")
    createRect(0,0, canvas.width, canvas.height)
    if(defeat)
    {
    canvasContext.font = "90px Arial"
    canvasContext.fillStyle = "red"
    canvasContext.fillText("GAME OVER", 30,300)

    canvasContext.font = "30px Arial"
    canvasContext.fillStyle = "red"
    canvasContext.fillText("Press F5 to replay", 170,340)
    }
    else
    {
        let luminosityEffect =  210 / (snake.tail.length + 1)
    for (let i = 0; i < snake.tail.length; i++){
        let h = snake.tail.length - i
        let colorLvl = 255 - (h * luminosityEffect)
        let colorString = "rgb("+colorLvl+","+colorLvl+","+ colorLvl+")"
        createRect(snake.tail[i].x + (2.5 * gameRatio), snake.tail[i].y + (2.5 * gameRatio),snake.size - (5 * gameRatio), snake.size - (5 * gameRatio), colorString)
    }
    createRect(apple.x, apple.y, apple.size - (5 * gameRatio), apple.size - (5 * gameRatio), apple.color)
    }   
    canvasContext.font = "20px Arial"
    canvasContext.fillStyle = "#00FF42"
    canvasContext.fillText("Score: " + (snake.tail.length -1),canvas.width - 120, 18)
    
    //change snake head color
    //let headTail = snake.tail[snake.tail.length - 1]
    //createRect(headTail.x + (2.5 * gameRatio), headTail.y + (2.5 * gameRatio), snake.size - (5 * gameRatio), snake.size - (5 * gameRatio), "grey")
}

function createRect(x,y,width, height,color) {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}

window.addEventListener("keydown", (event) => {
    setTimeout(() => {
        if (event.keyCode == 37 || event.keyCode == 65 && snake.rotateX != 1) {
            snake.rotateX = -1
            snake.rotateY = 0
        } else if (event.keyCode == 38 || event.keyCode == 87 && snake.rotateY != 1) {
            snake.rotateX = 0
            snake.rotateY = -1
        } else if (event.keyCode == 39 || event.keyCode == 68 && snake.rotateX != -1) {
            snake.rotateX = 1
            snake.rotateY = 0
        } else if (event.keyCode == 40 || event.keyCode == 83 && snake.rotateY != -1) {
            snake.rotateX = 0
            snake.rotateY = 1
        }
    }, 1)
})

class Snake {
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
        this.tail = [{x:this.x, y:this.y}]
        this.rotateX = 1
        this.rotateY = 0
    }

    move() {
        let newRect

        if (this.rotateX == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateX == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateY == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.rotateY == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift()
        this.tail.push(newRect)
    }
}

class Apple{
    constructor(){
        let isTouching
        
        while (true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
            
            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true
                }
            }

            this.size = snake.size 
            this.color = "red"

            if (!isTouching) {
                break;
            }
        }
    }
}

const snake = new Snake(Math.floor(canvas.width * 0.5), Math.floor(canvas.height * 0.5), 20 * gameRatio);
let apple = new Apple();