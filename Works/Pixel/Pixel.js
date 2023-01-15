var width = 32;
var height = 32;
var pixelsize = 20;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var backgroundCanvas = document.getElementById('background');
var btx = backgroundCanvas.getContext('2d')

var display = document.getElementById('display');
var brushcolor = document.getElementById('brushcolor');
var brushsize = document.getElementById('brushsize');


function setCanvas() {
    ctx.canvas.width = pixelsize * width;
    ctx.canvas.height = pixelsize * height;
    ctx.scale(pixelsize, pixelsize);

    btx.canvas.width = pixelsize * width;
    btx.canvas.height = pixelsize * height;
    btx.scale(pixelsize, pixelsize);

    display.style.width = pixelsize * width + 'px';
    display.style.height = pixelsize * height + 'px';

}

function setBackground() {
    btx.clearRect(0, 0, width, height);

    btx.fillStyle = "white";
    btx.fillRect(0, 0, width, height);

    btx.fillStyle = "rgb(220, 220, 220)";
    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++){
            if((x + y) % 2 == 0) {
                btx.fillRect(x, y, 1, 1);
            }
        }
    }
}

function drawon(x, y) {
    ctx.fillStyle = brushcolor.value
    x = Math.floor(x);
    y = Math.floor(y);
    var size = brushsize.value * 1;
    ctx.fillRect(x, y, size, size);
}

setCanvas();
setBackground();

var isDragging = false;

canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    var mouseX = event.offsetX / pixelsize;
    var mouseY = event.offsetY / pixelsize;
    drawon(mouseX, mouseY);
});

canvas.addEventListener('mousemove', (event) => {
    if (isDragging == false) return;
    var mouseX = event.offsetX / pixelsize;
    var mouseY = event.offsetY / pixelsize;
    drawon(mouseX, mouseY);
});

canvas.addEventListener('mouseup', () => {
    if(isDragging) setLocalStorage();
    isDragging = false;
});

canvas.addEventListener('mouseout', () => {
    if(isDragging) setLocalStorage();
    isDragging = false;
});

window.addEventListener('keydown', (event) => {
    if(event.keyCode == 90) {
        prevCanvas();
    }
});

var myStorage = localStorage;
window.onload = initLocalstorage();

function initLocalstorage() {
    myStorage.setItem("drawinglog", JSON.stringify([]));
    setLocalStorage();
}

function setLocalStorage() {
    var png = canvas.toDataURL();
    var logs = JSON.parse(myStorage.getItem('drawinglog'));

    setTimeout(() => {
        logs.unshift({png: png});
        myStorage.setItem("drawinglog", JSON.stringify(logs));
    }, 0); 
}

function prevCanvas() {
    var logs = JSON.parse(myStorage.getItem('drawinglog'));
    if(logs.length <= 1) return;
    setTimeout(() => {
        if(logs.length > 1) {
            logs.shift();
        }  
        myStorage.setItem("drawinglog", JSON.stringify(logs));
        drawPng(logs[0]['png']);
    }, 0);
}

function drawPng(src) {
    ctx.clearRect(0, 0, width, height);
    var img = new Image();
    img.src = src;
    img.onload = function() {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.drawImage(img, 0, 0);
        ctx.scale(pixelsize, pixelsize);
    }
}

var colors = ['#ffe4e1', '#fafad2', '#adeeee', '#ffb6c1', '#dda0dd', '#c382ee'];
function paletteSet(num) {
    brushcolor.value = colors[num -1];
}