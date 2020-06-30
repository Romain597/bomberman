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
    const bombMaxCount = 1000;
    const bombDelay = 3000;
    const hitLifeCount = 1;
    const foesClass = "tracker";
    const bombClass = "bomb"
    const initialX = 400;
    const initialY = 400;
    const startClearZone = 2;
    let hit = false;
    let inGame = false;
    //let playerPos = [initialY,initialX];
    let bombCount = bombMaxCount;
    let lifeCount = lifeMaxCount;
    let foesCount = foesMaxCount;
    let foesArray = [];
    let bombsArray = [];
    let hitsArray = [];

    function getPos(object,property) {
        return parseInt(window.getComputedStyle(object).getPropertyValue(property).replace("px",""));
    }
    function getPlayerPos() {
        return [getPos(player,"top"),getPos(player,"left")];
    }
    function collisionAction(minusLife) {
        player.classList.remove("collision");
        let intervalCollision = setInterval(() => {
            player.classList.toggle("collision");
        }, collisionDelay);
        setTimeout(() => {
            clearInterval(intervalCollision);
            player.classList.remove("collision");
        }, collisionDuration);
        if(minusLife) {
            lifeCount--;
            lifeNbElement.innerText = lifeCount;
        }
    }
    function testCollision(foe) {
        let playerPos = getPlayerPos();
        let val = false;
        if(foe!==null) {
            let tempEl = foe;
            let tempY = getPos(tempEl,"top");
            let tempX = getPos(tempEl,"left");
            if(tempY==playerPos[0] && tempX==playerPos[1]) {
                val = true;
                hitsArray.push([div[0]]);
                //return true;
            }
        }
        else {
            foesArray.forEach(div => {
                /*//console.log(div[1]+"=="+currentPos[0]+"&&"+div[2]+"=="+currentPos[1]);
                if(div[1]==currentPos[0] && div[2]==currentPos[1]) {
                    //console.log(div[1]+"=="+currentPos[0]+"&&"+div[2]+"=="+currentPos[1]);
                    val = true;
                }*/
                let tempEl = container.querySelector("#"+div[0]);
                let tempY = getPos(tempEl,"top");
                let tempX = getPos(tempEl,"left");
                if(tempY==playerPos[0] && tempX==playerPos[1]) {
                    val = true;
                    hitsArray.push([div[0]]);
                    //return true;
                }
            });
        }
        return val;
        //return false;
    }
    function gameFail() {
        inGame = false;
        let el = document.createElement("div"); 
        el.classList.add("bandeau-class");
        el.id = "bandeau";
        el.innerHTML = "<p>GAME OVER</p><p>Vous avez perdu !</p>";
        container.appendChild(el);
    }
    function gameWin() {
        inGame = false;
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
                        //console.log(samePos);
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
                        //console.log(samePos);
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
                        //console.log(samePos);
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
                        //console.log(samePos);
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
                            bombCount--;
                            bombNbElement.innerText = bombCount;
                        }
                    }
                break;
            }
        }
        //return newPosition;
    }
    function getRandomIntInclusive() {
        let min = 1;
        let max = Math.floor((maxOffset+offset)/offset);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
    function testPosPlayer(elY,elX) {
        let val = false;
        if(elY>=initialY-(startClearZone*offset) && elY<=initialY+(startClearZone*offset) && elX>=initialX-(startClearZone*offset) && elX<=initialX+(startClearZone*offset)) {
            //return true;
            val = true;
        }
        //return false;
        return val;
    }
    function testDirPosFoe(elY,elX,dir) {
        let val = false;
        if(dir!="none" && dir!="") {
            foesArray.forEach(div => {
                let tempEl = container.querySelector("#"+div[0]);
                let tempY = getPos(tempEl,"top");
                let tempX = getPos(tempEl,"left");
                if(dir=="all") {
                    if((elY-offset==tempY && elX==tempX) || (elY+offset==tempY && elX==tempX) || (elX-offset==tempX && elY==tempY) || (elX+offset==tempX && elY==tempY)) {
                        val = true;
                        //return true;
                    }
                }
                else if(dir=="top") {
                    if(elY-offset==tempY && elX==tempX) {
                        val = true;
                        //return true;
                    }
                }
                else if(dir=="bottom") {
                    if(elY+offset==tempY && elX==tempX) {
                        val = true;
                        //return true;
                    }
                }
                else if(dir=="right") {
                    if(elX-offset==tempX && elY==tempY) {
                        val = true;
                        //return true;
                    }
                }
                else if(dir=="left") {
                    if(elX+offset==tempX && elY==tempY) {
                        val = true;
                        //return true;
                    }
                }
            });
        }
        return val;
        //return false;
    }
    function testFoePosExist(elY,elX) {
        let val = false;
        foesArray.forEach(div => {
            let tempEl = container.querySelector("#"+div[0]);
            let tempY = getPos(tempEl,"top");
            let tempX = getPos(tempEl,"left");
            if(tempY==elY && tempX==elX) {
                //return true;
                val = true;
            }
        });
        //return false;
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
        /*else {
            return "none";
        }*/
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
                let offsetY = 0; let valY = getPos(el,"top");
                let offsetX = 0; let valX = getPos(el,"left");
                let dir = getFoesDirection(valY,valX);
                //console.log(dir);
                /*if(valY<=0 && dir=="top") {
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
                }*/
                /*let mur = true; let i = 0;
                while(mur) {
                    if(i>=3) {
                        mur = false;
                    }
                    i++;
                }
                if(valY<=0 || valY>=maxOffset || valX<=0 || valX>=maxOffset) {
                    mur = true;
                }*/
                //console.log(mur);
                let collision = testDirPosFoe(valY,valX,dir);
                while(collision) {
                    dir = getFoesDirection(valY,valX);
                    collision = testDirPosFoe(valY,valX,dir);
                }
                //console.log(collision);
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
                //console.log(offsetY,offsetX);
                el.style.top = (valY+offsetY)+"px";
                el.style.left = (valX+offsetX)+"px";
                let samePos = testCollision(el);
                //console.log(samePos);
                if(samePos) {
                    if(lifeCount>0) {
                        let notHit = true;
                        if(hitsArray.length>0) {
                            if(hitsArray[hitsArray.length-1][0]==el.id) {
                                notHit = false;
                            }
                        }
                        collisionAction(notHit);
                    }
                    else {
                        gameFail();
                    } 
                }
                //console.log(valY+offsetY,valX+offsetX);
            }, foesDelay);
            div.push(intervalRef);
        });
    }
    function foesStopMovement() {
        
    }
    function startGame() {
        let msg = container.querySelector("#bandeau");
        if(msg!==null) { 
            container.querySelector("#bandeau").remove(); 
        }
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
        //console.log(foesArray);
    }

    window.addEventListener("keyup", event => {
        //console.log(event.code); console.log(inGame);
        if(event.code=="Digit0" || event.code=="Numpad0") {
            startGame();
        }
        else if(inGame) {
            gameAction(event.code); //playerPos = 
            //console.log("playerPos "+playerPos);
        }
    });
};