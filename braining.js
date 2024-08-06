let can = document.getElementById("can");
let ctx = can.getContext("2d");
let points = calculatePoints();
let freePoints = points;
let usedLines = []

can.addEventListener('mousedown', function (e) {
    mouseDownEvent(e)
})

setupDraw()

function setupDraw() {
    ctx.clearRect(0, 0, 600, 600)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1;
    calculatePoints()
    ctx.beginPath();
    ctx.arc(300, 300, 300, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = "32px Arial";
    ctx.fillText("1", 150, 150);
    ctx.fillText("A", 300, 150);
    ctx.fillText("2", 450, 150);
    ctx.fillText("B", 450, 300);
    ctx.fillText("3", 450, 450);
    ctx.fillText("C", 300, 450);
    ctx.fillText("4", 150, 450);
    ctx.fillText("D", 150, 300);
}

function calculatePoints() {
    let array = [];
    let piDiv = 2 * (Math.PI) / 16
    for (let i = 0; i < 16; i++) {
        let x = 300 + 300 * Math.cos(piDiv * i)
        let y = 300 + 300 * Math.sin(piDiv * i)
        array.push({ x: x, y: y })
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.stroke();
    }
    return array
}

function mouseDownEvent(e) {
    let pos = getMousePos(e);
    let rand = Math.floor(Math.random() * freePoints.length);
    if(points[rand] == null){
        usedLines.push(lineObject(0, 0, 0, 0, "#000"))
        draw();
        return;
    }
    let xDir = points[rand].x + ((pos.x - points[rand].x) * 12)
    let yDir = points[rand].y + ((pos.y - points[rand].y) * 12)
    let lineObj = lineObject(points[rand].x, points[rand].y, xDir, yDir, "#008000")
    usedLines.push(lineObj)
    draw()
    freePoints.splice(rand, 1)
}

function getMousePos(evt) {
    let rect = can.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function draw() {
    setupDraw()
    let lineCount = usedLines.length
    for (let i = lineCount < 6 ? 0 : lineCount - 6; i < lineCount; i++) {
        if (lineCount > 5 && lineCount - i > 5)
            drawLine(usedLines[i], "#f0f");
        else
            drawLine(usedLines[i]);
    }
}

function drawLine(obj, color) {
    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.strokeStyle = color==null ? obj.color : color;
    ctx.moveTo(obj.xs, obj.ys)
    ctx.lineTo(obj.xd, obj.yd);
    ctx.stroke();
}
//#008000 #ffa500
function lineObject(xs, ys, xd, yd, color) {
    return {
        xs: xs,
        ys: ys,
        xd: xd,
        yd: yd,
        color: color
    }
}