
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const rectempty = new Image();
rectempty.src = "rectempty.png";

const rectdanger = new Image();
rectdanger.src = "rectdanger.png";

const rectclear = new Image();
rectclear.src = "rectclear.png";

const rectded = new Image();
rectded.src = "rectded.png";

const selection = new Image();
selection.src = "selection.png";

const selection2 = new Image();
selection2.src = "selection2.png";

const player3 = new Image();
player3.src = "3.png";

const player2 = new Image();
player2.src = "2.png";

const player1 = new Image();
player1.src = "1.png";

const stack = new Image();
stack.src = "stack.png";


const playerImages = [new Image(), new Image(), new Image(), new Image(), new Image()]
playerImages[0].src = "selection2.png"
playerImages[1].src = "1.png"
playerImages[2].src = "2.png"
playerImages[3].src = "3.png"
playerImages[4].src = "ded.png"


function playerObj(id = 0, image = 0, x = 0, y = 0, dist = 0, angle = 0) {
    this.id = id;
    this.image = image;
    this.x = x;
    this.y = y;
    this.dist = dist;
    this.maxdist = 160 * 3
    this.angle = angle;
    this.selectState = 0;
    this.width = 26;
    this.height = 36;
    this.hasStack = false;
    this.shouldMove = true;
    this.dead = false;
}

function lineObj() {

    this.startX = Math.random() * 400;
    this.startY = Math.random() * 100;
    this.endX = 0;
    this.endy = 0;
    this.shouldDraw = false;
}

var mousePos = { x: 0, y: 0 }
var running = false;

var player = [new playerObj(0, 1, 0), new playerObj(1, 2, 80), new playerObj(2, 2, 160), new playerObj(3, 3, 240)]
var lines = [new lineObj(), new lineObj(), new lineObj(), new lineObj()]

var gridState = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
]

function init(){
    gridState = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0]
    ];
    player = [new playerObj(0, 1, 0), new playerObj(1, 2, 80), new playerObj(2, 2, 160), new playerObj(3, 3, 240)];
    lines = [new lineObj(), new lineObj(), new lineObj(), new lineObj()];
    running = false;
}
function drawGridState() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            switch (gridState[j][i]) {
                case 0:
                    ctx.drawImage(rectempty, i * 160, j * 160);
                    break;
                case 1:
                    ctx.drawImage(rectdanger, i * 160, j * 160)
                    break;
                case 2:
                    ctx.drawImage(rectclear, i * 160, j * 160)
                    break;
                case 3:
                    ctx.drawImage(rectded, i * 160, j * 160)
                    break;
            }

        }

    }
}

function drawPlayer() {
    player.forEach(player => {
        ctx.drawImage(playerImages[player.image], player.x, player.y)
        if (player.selectState == 1) {
            ctx.drawImage(selection, player.x, player.y)
        }
        else if (player.selectState == 2) {
            ctx.drawImage(selection2, player.x, player.y)
            ctx.beginPath();
            ctx.moveTo(player.x + 13, player.y + 18);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
        }

        if(player.dead){
            ctx.drawImage(playerImages[4], player.x, player.y)
        }

        if(player.hasStack){
            ctx.drawImage(stack, player.x-125+13, player.y-125+18)
        }
    })
}

function drawLines() {
    lines.forEach(line => {
        if (!line.shouldDraw) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endy);
        ctx.stroke();
    })
}

function calculateAngle(xs, ys, xe, ye) {
    let dx = xe - xs;
    let dy = ye - ys;
    let result = Math.atan2(dy, dx)
    console.log(result)
    return result
}

function movePlayer() {
    if (!running)
        return;
    let speed = 10;
    player.forEach(player => {
        if (!player.shouldMove) {
            return;
        }

        //fucking what is this a math class
        let cos = Math.cos(player.angle)
        let sin = Math.sin(player.angle)
        // i have no fucking idea how cos and sin works but it looks right 
        let movementX = (cos * speed) / (Math.abs(cos) + Math.abs(sin))
        let movementY = (sin * speed) / (Math.abs(cos) + Math.abs(sin))
        player.x += movementX
        player.y += movementY
        player.dist += Math.abs(movementX) + Math.abs(movementY)

        if (player.dist > player.maxdist){
            player.shouldMove = false;
            if(player.image != 0){
                player.dead = true;
            }}
    })
}

function checkCollision() {
    if (!running)
        return;
    player.forEach(player => {
        let gridPosX = Math.floor(player.x / 160);
        let gridPosY = Math.floor(player.y / 160);
        if (gridState[gridPosY][gridPosX] == 1) {
            gridState[gridPosY][gridPosX] = 2
            player.image--;
            if (player.image < 0) {
                player.image = 4;
                player.dead = true;
                gridState[gridPosY][gridPosX] = 3
            }
        }

    })
}

function main() {
    ctx.clearRect(0, 0, 800, 800)
    drawGridState();
    drawPlayer();
    drawLines();
    movePlayer();
    checkCollision();
}

function startButton() {
    running = true;
}

function resetButton(){
init();
}

function backToStart(){
    gridState = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0]
    ];
    player[0].image = 1
    player[1].image = 2
    player[2].image = 2
    player[3].image = 3

    for(let i = 0; i < 4; i++){
        running = false
        
        player[i].dead = false;
        player[i].shouldMove = true;
        player[i].x = lines[i].startX-13
        player[i].y = lines[i].startY-18
        player[i].dist = 0;
    }

}

function toggleStack(index){
player[index].hasStack = !player[index].hasStack  
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener("click", function (evt) {
    mousePos = getMousePos(canvas, evt);
    player.forEach(player => {
        if (player.selectState == 1) {
            player.x = mousePos.x - 13;
            player.y = mousePos.y - 18;
            player.selectState = 2;
            return;
        }
        if (player.selectState == 2) {
            lines[player.id].startX = player.x + 13;
            lines[player.id].startY = player.y + 18;
            lines[player.id].endX = mousePos.x;
            lines[player.id].endy = mousePos.y;
            lines[player.id].shouldDraw = true;
            player.selectState = 0;
            player.angle = calculateAngle(lines[player.id].startX, lines[player.id].startY, lines[player.id].endX, lines[player.id].endy)

        }
        if ((mousePos.x > player.x && mousePos.x < player.x + player.width) && (mousePos.y > player.y && mousePos.y < player.y + player.height)) {
            player.selectState = 1;
        }

    });
});

canvas.addEventListener("mousemove", function (evt) {
    mousePos = getMousePos(canvas, evt);
    player.forEach(player => {
        if (player.selectState == 1) {
            player.x = mousePos.x - 13;
            player.y = mousePos.y - 18;
        }
    })
});

setInterval(main, 50);
