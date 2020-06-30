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
    let playerPos = [initialY,initialX];
    let bombCount = bombMaxCount;
    let lifeCount = lifeMaxCount;
    let foesCount = foesMaxCount;
    let foesArray = [];
    let bombsArray = [];

    function getPlayerPos() {
        return [parseInt(window.getComputedStyle(player).getPropertyValue("top")),parseInt(window.getComputedStyle(player).getPropertyValue("left"))];
    }
    function collisionAction() {
        player.classList.remove("collision");
        let intervalCollision = setInterval(() => {
            player.classList.toggle("collision");
        }, collisionDelay);
        setTimeout(() => {
            clearInterval(intervalCollision);
            player.classList.remove("collision");
        }, collisionDuration);
        lifeCount--;
        lifeNbElement.innerText = lifeCount;
    }
    function testCollision() {
        let currentPos = playerPos;
        let val = false;
        foesArray.forEach(div => {
            //console.log(div[1]+"=="+currentPos[0]+"&&"+div[2]+"=="+currentPos[1]);
            if(div[1]==currentPos[0] && div[2]==currentPos[1]) {
                //console.log(div[1]+"=="+currentPos[0]+"&&"+div[2]+"=="+currentPos[1]);
                val = true;
            }
        });
        return val;
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
    function gameAction(keyCode)
    {
        let currentPos = playerPos; //getPlayerPos();
        let newPosition = currentPos;
        if(lifeCount>=0) {
            switch(keyCode) {
                case "ArrowUp":
                    if(currentPos[0]>=offset) {
                        newPosition[0] -= offset;
                        player.style.top = newPosition[0]+"px";
                        let samePos = testCollision();
                        //console.log(samePos);
                        if(samePos) {
                            if(lifeCount>0) {
                                collisionAction();
                            }
                            else {
                                gameFail();
                            }                       
                        }
                    }
                break;
                case "ArrowDown":
                    if(currentPos[0]<=(maxOffset-offset)) {
                        newPosition[0] += offset;
                        player.style.top = newPosition[0]+"px";
                        let samePos = testCollision();
                        //console.log(samePos);
                        if(samePos) {
                            if(lifeCount>0) {
                                collisionAction();
                            }
                            else {
                                gameFail();
                            } 
                        }
                    }
                break;
                case "ArrowLeft":
                    if(currentPos[1]>=offset) {
                        newPosition[1] -= offset;
                        player.style.left = newPosition[1]+"px";
                        let samePos = testCollision();
                        //console.log(samePos);
                        if(samePos) {
                            if(lifeCount>0) {
                                collisionAction();
                            }
                            else {
                                gameFail();
                            } 
                        }
                    }
                break;
                case "ArrowRight":
                    if(currentPos[1]<=(maxOffset-offset)) {
                        newPosition[1] += offset;
                        player.style.left = newPosition[1]+"px";
                        let samePos = testCollision();
                        //console.log(samePos);
                        if(samePos) {
                            if(lifeCount>0) {
                                collisionAction();
                            }
                            else {
                                gameFail();
                            } 
                        }
                    }
                break;
                case "Space":
                    if(bombCount>0) {
                        let el = document.createElement("div"); 
                        el.classList.add(bombClass);
                        el.id = "bomb"+bombCount;
                        el.style.top = currentPos[0]+"px";
                        el.style.left = currentPos[1]+"px";
                        container.appendChild(el);
                        bombCount--;
                        bombNbElement.innerText = bombCount;
                    }
                break;
            }
        }
        return newPosition;
    }
    function getRandomIntInclusive() {
        let min = 1;
        let max = Math.floor((maxOffset+offset)/offset);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
    function testPosPlayer(elY,elX) {
        if(elY>=initialY-(startClearZone*offset) && elY<=initialY+(startClearZone*offset) && elX>=initialX-(startClearZone*offset) && elX<=initialX+(startClearZone*offset)) {
            return true;
        }
        return false;
    }
    function testFoePosExist(elY,elX) {
        foesArray.forEach(div => {
            if(div[1]==elY && div[2]==elX) {
                return true;
            }
        });
        return false;
    }
    function getFoesDirection() {
        let valN = Math.floor(Math.random() * (5 - 1 +1)) + 1;
        if(valN==1) {
            return "top";
        }
        else if(valN==2) {
            return "bottom";
        }
        else if(valN==3) {
            return "right";
        }
        else if(valN==4) {
            return "left";
        }
        else {
            return "none";
        }
    }
    function foesInMovement() {
        foesArray.forEach(div => {
            let intervalRef = setInterval(() => {
                let el = container.querySelector("#"+div[0]);
                let offsetY = 0; let valY = parseInt(window.getComputedStyle(el,null).top.replace("px",""));
                let offsetX = 0; let valX = parseInt(window.getComputedStyle(el,null).left.replace("px",""));
                let dir = getFoesDirection();
                //console.log(dir);
                let mur = false;
                if(valY<=0 || valY>=maxOffset || valX<=0 || valX>=maxOffset) {
                    mur = true;
                }
                //console.log(mur);
                switch(dir) {
                    case "top":
                        if(mur) {
                            offsetY += offset;
                        }
                        else {
                            offsetY -= offset;
                        }
                    break;
                    case "bottom":
                        if(mur) {
                            offsetY -= offset;
                        }
                        else {
                            offsetY += offset;
                        }
                    break;
                    case "right":
                        if(mur) {
                            offsetX += offset;
                        }
                        else {
                            offsetX -= offset; 
                        }
                    break;
                    case "left":
                        if(mur) {
                            offsetX -= offset;
                        }
                        else {
                            offsetX += offset; 
                        }
                    break;
                }
                console.log(offsetY,offsetX);
                el.style.top = (valY+offsetY)+"px";
                el.style.left = (valX+offsetX)+"px";
                console.log(valY+offsetY,valX+offsetX);
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
        playerPos = [initialY,initialX];
        player.style.top = playerPos[0]+"px";
        player.style.left = playerPos[1]+"px";
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
            foesArray.push([el.id,y,x]);
        }
        inGame = true;
        foesInMovement();
        console.log(foesArray);
    }

    window.addEventListener("keyup", event => {
        //console.log(event.code); console.log(inGame);
        if(event.code=="Digit0" || event.code=="Numpad0") {
            startGame();
        }
        else if(inGame) {
            playerPos = gameAction(event.code);
            //console.log("playerPos "+playerPos);
        }
    });
};