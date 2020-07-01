window.onload = () => {
    const player = document.querySelector("#player");
    const lifeNbElement = document.querySelector("#life-count");
    const bombNbElement = document.querySelector("#bomb-count");
    const container = document.querySelector("#game-container");
    const offset = 50;
    const lifeMaxCount = 10;
    const foesMaxCount = 10;
    const maxOffset = 800;
    const foesDelay = 500;
    const collisionDelay = 500;
    const collisionDuration = 4000;
    const bombMaxCount = 10;
    const bombDelay = 3000;
    const hitLifeCount = 1;
    const foesClass = "tracker";
    const bombClass = "bomb"
    const initialX = 400;
    const initialY = 400;
    const startClearZone = 2;
    const explosionRadius = 2;
    const explosionClass = "explosion";
    const bombBlinkClass = "bomb-blink"
    const bombBlinkInterval = 500;
    //const indexX = 1;
    //const indexY = 0;
    let inGame = false;
    //let playerPos = [initialY,initialX];
    let bombCount = bombMaxCount;
    let lifeCount = lifeMaxCount;
    let foesCount = foesMaxCount;
    let foesArray = [];
    let bombsArray = [];
    let timeoutArray = [];
    //let hitsArray = [];

    function getPos(object,property) {
        return parseInt(window.getComputedStyle(object).getPropertyValue(property).replace("px",""));
    }
    function getPlayerPos() {
        return [getPos(player,"top"),getPos(player,"left")];
    }
    function detectPlayerInRadius(valY,valX) {
        let val = false;
        let player = getPlayerPos();
        let elY = player[0]; 
        let elX = player[1]; 
        if(elY>=valY-(explosionRadius*offset) && elY<=valY+(explosionRadius*offset) && elX>=valX-(explosionRadius*offset) && elX<=valX+(explosionRadius*offset)) {
            val = true;
        }
        return val;
    }
    function detectFoesInRadius(valY,valX) {
        let indexArray = [];
        for(let pos = 0; pos <= foesArray.length-1; pos++) {
            let foe = foesArray[pos];
            let el = container.querySelector("#"+foe[0]);
            //console.log("1 "+el);
            let elY = getPos(el,"top"); 
            let elX = getPos(el,"left"); 
            if(elY>=valY-(explosionRadius*offset) && elY<=valY+(explosionRadius*offset) && elX>=valX-(explosionRadius*offset) && elX<=valX+(explosionRadius*offset)) {
                indexArray.push(pos);
            }
        }
        return indexArray;
    }
    function deleteFoesInRadius(foesInRadius) {
        if(foesInRadius.length>0) {
            foesInRadius.forEach(index => {
                let el = container.querySelector("#"+foesArray[index][0]);
                clearInterval(foesArray[index][1]);
                el.remove();
                foesArray.slice(index,1);
                foesCount--;
            });
        }
    }
    function bombAction(indexInArray,valY,valX) {
        let bomb = container.querySelector("#"+bombsArray[indexInArray]);
        let interval = setInterval(() => {
            bomb.classList.toggle(bombBlinkClass);
        }, bombBlinkInterval);
        let fId = setTimeout(() => {
            clearInterval(interval);
            bomb.classList.remove(bombBlinkClass);
            bomb.classList.remove(bombClass);
            bomb.classList.add(explosionClass);
            bomb.style.top = valY;
            bomb.style.left = valX;
            let scale = 1+(explosionRadius*2);
            bomb.style.transform = "scale("+scale+")";
            let fIdBis = setTimeout(() => {
                let foesInRadius = detectFoesInRadius(valY,valX);
                let playerInRadius = detectPlayerInRadius(valY,valX);
                deleteFoesInRadius(foesInRadius);
                bomb.remove();
                bombsArray.splice(indexInArray,1);
                let indexB = timeoutArray.indexOf(fIdBis);; 
                timeoutArray.slice(indexB,1);
                if(playerInRadius) {
                    collisionAction(true);
                }
                if(foesCount==0 && lifeCount>0) {
                    gameWin();
                }
                else if(bombCount==0 || lifeCount==0) {
                    gameFail();
                }
            }, 500);
            timeoutArray.push(fIdBis);
            let index = timeoutArray.indexOf(fId); 
            timeoutArray.slice(index,1);
        }, bombDelay);
        timeoutArray.push(fId);
    }
    function collisionAction(minusLife) {
        player.classList.remove("collision");
        let intervalCollision = setInterval(() => {
            player.classList.toggle("collision");
        }, collisionDelay);
        let fId = setTimeout(() => {
            clearInterval(intervalCollision);
            player.classList.remove("collision");
            let index = timeoutArray.indexOf(fId);; 
            timeoutArray.slice(index,1);
        }, collisionDuration);
        timeoutArray.push(fId);
        if(minusLife) {
            lifeCount -= hitLifeCount;
            lifeNbElement.innerText = lifeCount;
        }
    }
    function testCollision(foe) {
        let playerPos = getPlayerPos();
        let val = false;
        if(foe!==null && typeof(foe)!=='undefined') {
            //console.log("2 "+foe);
            let tempY = getPos(foe,"top");
            let tempX = getPos(foe,"left");
            if(tempY==playerPos[0] && tempX==playerPos[1]) {
                val = true;
            }
        }
        else {
            foesArray.forEach(div => {
                let tempEl = container.querySelector("#"+div[0]);
                //console.log("3 "+tempEl);
                let tempY = getPos(tempEl,"top");
                let tempX = getPos(tempEl,"left");
                if(tempY==playerPos[0] && tempX==playerPos[1]) {
                    val = true;
                }
            });
        }
        return val;
    }
    function stopAnimation() {
        foesArray.forEach(foe => {
            clearInterval(foe[1]);
        });
        let len = timeoutArray.length;
        for(let i = 0; i <= len-1; i++) {
            if(typeof(timeoutArray[i])!=='undefined') {
                clearTimeout(timeoutArray[i]);
            }
        }
    }
    function gameFail() {
        inGame = false;
        stopAnimation();
        let el = document.createElement("div"); 
        el.classList.add("bandeau-class");
        el.id = "bandeau";
        el.innerHTML = "<p>GAME OVER</p><p>Vous avez perdu !</p>";
        container.appendChild(el);
    }
    function gameWin() {
        inGame = false;
        stopAnimation();
        let el = document.createElement("div"); 
        el.classList.add("bandeau-class");
        el.id = "bandeau";
        el.innerHTML = "<p>GAME WIN</p><p>Vous avez gagné !</p>";
        container.appendChild(el);
    }
    function testBombPosExist(elY,elX) {
        let val = false;
        if(bombsArray.length>0) {
            let tempEl = container.querySelector("#"+bombsArray[bombsArray.length-1][0]);
            //console.log("4 "+tempEl);
            let tempY = getPos(tempEl,"top");
            let tempX = getPos(tempEl,"left");
            if(tempY==elY && tempX==elX) {
                val = true;
            }
        }
        return val;
    }
    function gameAction(keyCode)
    {
        let playerPos = getPlayerPos();
        let newPosition = playerPos;
        if(lifeCount>=0) {
            switch(keyCode) {
                case "ArrowUp":
                    if(playerPos[0]>=offset) {
                        newPosition[0] -= offset;
                        player.style.top = newPosition[0]+"px";
                        let samePos = testCollision();
                        if(samePos) {
                            if(lifeCount>0) {
                                collisionAction(true);
                            }
                            else {
                                gameFail();
                            }                       
                        }
                    }
                break;
                case "ArrowDown":
                    if(playerPos[0]<=(maxOffset-offset)) {
                        newPosition[0] += offset;
                        player.style.top = newPosition[0]+"px";
                        let samePos = testCollision();
                        if(samePos) {
                            if(lifeCount>0) {
                                collisionAction(true);
                            }
                            else {
                                gameFail();
                            } 
                        }
                    }
                break;
                case "ArrowLeft":
                    if(playerPos[1]>=offset) {
                        newPosition[1] -= offset;
                        player.style.left = newPosition[1]+"px";
                        let samePos = testCollision();
                        if(samePos) {
                            if(lifeCount>0) {
                                collisionAction(true);
                            }
                            else {
                                gameFail();
                            } 
                        }
                    }
                break;
                case "ArrowRight":
                    if(playerPos[1]<=(maxOffset-offset)) {
                        newPosition[1] += offset;
                        player.style.left = newPosition[1]+"px";
                        let samePos = testCollision();
                        if(samePos) {
                            if(lifeCount>0) {
                                collisionAction(true);
                            }
                            else {
                                gameFail();
                            } 
                        }
                    }
                break;
                case "Space":
                    if(bombCount>0) {
                        if(testBombPosExist(playerPos[0],playerPos[1])==false) {
                            let el = document.createElement("div"); 
                            el.classList.add(bombClass);
                            el.id = "bomb"+bombCount;
                            el.style.top = playerPos[0]+"px";
                            el.style.left = playerPos[1]+"px";
                            container.appendChild(el);
                            bombsArray.push([el.id]);
                            let index = bombsArray.length-1;
                            bombCount--;
                            bombNbElement.innerText = bombCount;
                            bombAction(index,playerPos[0],playerPos[1]);
                        }
                    }
                break;
            }
        }
    }
    function getRandomIntInclusive() {
        let min = 1;
        let max = Math.floor((maxOffset+offset)/offset);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
    function testPosPlayer(elY,elX) {
        let val = false;
        if(elY>=initialY-(startClearZone*offset) && elY<=initialY+(startClearZone*offset) && elX>=initialX-(startClearZone*offset) && elX<=initialX+(startClearZone*offset)) {
            val = true;
        }
        return val;
    }
    function testDirPosFoe(elY,elX,dir) {
        let val = false;
        if(dir!="none" && dir!="") {
            foesArray.forEach(div => {
                let tempEl = container.querySelector("#"+div[0]);
                //console.log("5 "+tempEl);
                //if(tempEl!==null && typeof(tempEl)!=='undefined') { console.log(div); }
                //if(tempEl!==null && typeof(tempEl)!=='undefined') {
                    let tempY = getPos(tempEl,"top");
                    let tempX = getPos(tempEl,"left");
                    if(dir=="all") {
                        if((elY-offset==tempY && elX==tempX) || (elY+offset==tempY && elX==tempX) || (elX-offset==tempX && elY==tempY) || (elX+offset==tempX && elY==tempY)) {
                            val = true;
                        }
                    }
                    else if(dir=="top") {
                        if(elY-offset==tempY && elX==tempX) {
                            val = true;
                        }
                    }
                    else if(dir=="bottom") {
                        if(elY+offset==tempY && elX==tempX) {
                            val = true;
                        }
                    }
                    else if(dir=="right") {
                        if(elX-offset==tempX && elY==tempY) {
                            val = true;
                        }
                    }
                    else if(dir=="left") {
                        if(elX+offset==tempX && elY==tempY) {
                            val = true;
                        }
                    }
                //}
            });
        }
        return val;
    }
    function testFoePosExist(elY,elX) {
        let val = false;
        foesArray.forEach(div => {
            let tempEl = container.querySelector("#"+div[0]);
            //console.log("6 "+tempEl);
            let tempY = getPos(tempEl,"top");
            let tempX = getPos(tempEl,"left");
            if(tempY==elY && tempX==elX) {
                val = true;
            }
        });
        return val;
    }
    function getFoesDirection(valY,valX) {
        let valN = Math.floor(Math.random() * (5 - 1 +1)) + 1;
        let dir = "none";
        if(valN==1) {
            dir = "top";
        }
        else if(valN==2) {
            dir = "bottom";
        }
        else if(valN==3) {
            dir = "right";
        }
        else if(valN==4) {
            dir = "left";
        }
        if(valY!==null && valX!==null) {
            if(valY<=0 && dir=="top") {
                dir = "bottom";
            }
            else if(valY>=maxOffset && dir=="bottom") {
                dir = "top";
            }
            else if(valX>=maxOffset && dir=="left") {
                dir = "right";
            }
            else if(valX<=0 && dir=="right") {
                dir = "left";
            }
        }
        return dir;
    }
    function foesInMovement() {
        foesArray.forEach(div => {
            let intervalRef = setInterval(() => {
                let el = container.querySelector("#"+div[0]);
                //console.log("7 "+el);
                let offsetY = 0; let valY = getPos(el,"top");
                let offsetX = 0; let valX = getPos(el,"left");
                let dir = getFoesDirection(valY,valX);
                let collision = testDirPosFoe(valY,valX,dir);
                while(collision) {
                    dir = getFoesDirection(valY,valX);
                    collision = testDirPosFoe(valY,valX,dir);
                }
                switch(dir) {
                    case "top":
                        offsetY -= offset;
                    break;
                    case "bottom":
                        offsetY += offset;
                    break;
                    case "right":
                        offsetX -= offset; 
                    break;
                    case "left":
                        offsetX += offset; 
                    break;
                }
                el.style.top = (valY+offsetY)+"px";
                el.style.left = (valX+offsetX)+"px";
                let samePos = testCollision(el);
                if(samePos) {
                    if(lifeCount>0) {
                        collisionAction(true);
                    }
                    else {
                        gameFail();
                    } 
                }
            }, foesDelay);
            div.push(intervalRef);
        });
    }
    function startGame() {
        let msg = container.querySelector("#bandeau");
        if(msg!==null) { 
            container.querySelector("#bandeau").remove(); 
        }
        inGame = false;
        bombCount = bombMaxCount;
        lifeCount = lifeMaxCount;
        foesCount = foesMaxCount;
        foesArray = [];
        bombsArray = [];
        timeoutArray = [];
        //playerPos = [initialY,initialX];
        player.style.top = initialY+"px";
        player.style.left = initialX+"px";
        lifeNbElement.innerText = lifeCount;
        bombNbElement.innerText = bombCount;
        let oldEl = container.querySelectorAll("div.tracker,div.bomb");
        oldEl.forEach(div => {
            div.remove();
        });
        for(let i = 1;i<=foesCount;i++) {
            let x = (getRandomIntInclusive()-1)*offset;
            let y = (getRandomIntInclusive()-1)*offset;
            while(testFoePosExist(y,x) || testPosPlayer(y,x)) {
                x = (getRandomIntInclusive()-1)*offset;
                y = (getRandomIntInclusive()-1)*offset;
            }
            let el = document.createElement("div"); 
            el.classList.add(foesClass);
            el.id = "foe"+i;
            el.style.top = y+"px";
            el.style.left = x+"px";
            container.appendChild(el);
            foesArray.push([el.id]);
        }
        inGame = true;
        foesInMovement();
    }

    window.addEventListener("keyup", event => {
        //console.log(event.code); console.log(inGame);
        if(event.code=="Digit0" || event.code=="Numpad0") {
            startGame();
        }
        else if(inGame) {
            gameAction(event.code);
        }
    });
};