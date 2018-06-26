const speedDash = document.querySelector('.speedDash');
const scoreDash = document.querySelector('.scoreDash');
const lifeDash = document.querySelector('.lifeDash');
const container = document.getElementById('container');
const btnStart = document.querySelector('.btnStart');
let animationGame = requestAnimationFrame(playGame);
let gamePlay = false;
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}
let player = {};

btnStart.addEventListener('click', startGame);
document.addEventListener('keydown', pressKeyOn);
document.addEventListener('keyup', pressKeyOff);

function playGame() {
    if (player.gameEndCounter > 0) {
        player.gameEndCounter--;
        player.y = (player.y > 60) ? player.y - 30 : 60;
        if (player.gameEndCounter == 0) {
            gamePlay = false;
            cancelAnimationFrame(animationGame);
            btnStart.style.display = 'block';
        }
    }
    if (gamePlay) {
        updateDash();

        let roadParams = moveRoad();
        moveBadGuys();
        //console.log(roadParams);
        //Movement
        if (keys.ArrowUp) {
            if (player.ele.y > 450)
                player.ele.y -= 1;
            player.speed = player.speed < 20 ? player.speed + 0.05 : 20;
        }
        if (keys.ArrowDown) {
            if (player.ele.y < 500)
                player.ele.y += 1;
            player.speed = player.speed > 0 ? player.speed - 0.05 : 0;
        }
        if (keys.ArrowRight) {
            player.ele.x += player.speed / 4;
        }
        if (keys.ArrowLeft) {
            player.ele.x -= player.speed / 4;
        }

        if ((player.ele.x + 40 < roadParams.left) || (player.ele.x > (roadParams.left + roadParams.width))) {
            if (player.ele.y < 500)
                player.ele.y += 1;
            player.speed = player.speed > 0 ? player.speed - 0.2 : 2;
            console.log('OFF ROAD');
        }
        player.ele.style.top = player.ele.y + 'px';
        player.ele.style.left = player.ele.x + 'px';
    }
    animationGame = requestAnimationFrame(playGame);
}

function startGame() {
    container.innerHTML = '';
    btnStart.style.display = 'none';
    var div = document.createElement('div');
    div.setAttribute('class', 'playerCar');
    div.x = 250;
    div.y = 500;
    container.appendChild(div);
    gamePlay = true;
    player = {
        ele: div,
        speed: 0,
        lives: 3,
        gameScore: 0,
        carsToPass: 3,
        score: 0,
        roadWidth: 250,
        gameEndCounter: 0
    };
    startBoard();
    setupBadGuys(10);
}

function pressKeyOn(event) {
    event.preventDefault();
    //console.log(keys);
    keys[event.key] = true;
}

function pressKeyOff(event) {
    event.preventDefault();
    console.log(keys);
    keys[event.key] = false;
}

function updateDash() {
    //console.log(player);
    scoreDash.innerHTML = player.score;
    lifeDash.innerHTML = player.lives;
    speedDash.innerHTML = Math.round(player.speed * 13);
}

function startBoard() {
    for (let x = 0; x < 13; x++) {
        let div = document.createElement('div');
        div.setAttribute('class', 'road');
        div.style.top = (x * 50) + 'px';
        div.style.width = player.roadWidth + 'px';
        container.appendChild(div);
    }
}

function moveRoad() {
    let tempRoad = document.querySelectorAll('.road');
    let previousRoad = tempRoad[0].offsetLeft;
    let previousRoadWidth = tempRoad[0].offsetWidth;
    for (let x = 0; x < tempRoad.length; x++) {
        let num = tempRoad[x].offsetTop + player.speed;
        //console.log(num);
        if (num > 600) {
            num -= 650;
            let mover = previousRoad + (Math.floor(Math.random() * 6) - 3);
            let roadWidth = (Math.floor(Math.random() * 11) - 5) + previousRoadWidth;
            if (roadWidth < 200) {
                roadWidth = 200;
            }
            if (roadWidth > 400) {
                roadWidth = 400;
            }
            if (mover < 100) {
                mover = 100;
            }
            if (mover > 600) {
                mover = 600;
            }
            tempRoad[x].style.left = mover + 'px';
            tempRoad[x].style.width = roadWidth + 'px';
            previousRoad = tempRoad[x].offsetLeft;
            previousRoadWidth = tempRoad[x].offsetWidth;
        }
        tempRoad[x].style.top = num + 'px';
    }
    return ({
        'width': previousRoad,
        'left': previousRoadWidth
    });
}

function setupBadGuys(num) {
    for (let x = 0; x < num; x++) {
        let temp = 'badGuy' + (x + 1);
        let div = document.createElement('div');
        div.innerHTML = x + 1;
        div.setAttribute('class', 'baddy');
        div.setAttribute('id', temp);
        div.style.backgroundColor = randomColor();
        makeBad(div);
        container.appendChild(div);
    }
}

function makeBad(e) {
    let tempRoad = document.querySelector('.road');
    e.style.left = tempRoad.offsetLeft + Math.ceil(Math.random() * tempRoad.offsetWidth) - 30 + 'px';
    e.style.top = Math.ceil(Math.random() * -400) + 'px';
    e.speed = Math.ceil(Math.random() * 17) + 2;
}

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ('0' + String(hex)).substr(-2);
    }
    return '#' + c() + c() + c();
}

function moveBadGuys() {
    let tempBaddy = document.querySelectorAll('.baddy');
    for (let i = 0; i < tempBaddy.length; i++) {
        for (let j = 0; j < tempBaddy.length; j++) {
            if (i != j && isCollide(tempBaddy[i], tempBaddy[j])) {
                tempBaddy[j].style.top = (tempBaddy[j].offsetTop + 50) + 'px';
                tempBaddy[i].style.top = (tempBaddy[i].offsetTop - 50) + 'px';
                tempBaddy[j].style.left = (tempBaddy[j].offsetLeft - 50) + 'px';
                tempBaddy[i].style.left = (tempBaddy[i].offsetLeft + 50) + 'px';
            }
        }
        let y = tempBaddy[i].offsetTop + player.speed - tempBaddy[i].speed;
        if (y > 2000 || y < -2000) {
            //reset car
            if (y > 2000) {
                player.score++;
                if (player.score > player.carsToPass) {
                    gameOverPlay();
                }
            }
            makeBad(tempBaddy[i]);
        } else {
            tempBaddy[i].style.top = y + 'px';
            let hitCar = isCollide(tempBaddy[i], player.ele);
            console.log(hitCar);
            if (hitCar) {
                player.speed = 0;
                player.lives--;
                if (player.lives < 1) {
                    player.gameEndCounter = 1;
                }
                makeBad(tempBaddy[i]);
            }
        }
    }
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    //console.log(aRect);

    return !(
        (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) || (aRect.right < bRect.left) || (aRect.left > bRect.right))

}

function gameOverPlay() {
    let div = document.createElement('div');
    div.setAttribute('class', 'road');
    div.style.top = '0px';
    div.style.width = '250px';
    div.style.backgroundColor = 'red';
    div.innerHTML = 'FINISH';
    div.style.fontSize = '3em';
    container.appendChild(div);
    player.gameEndCounter = 12;
    player.speed = 0;
}