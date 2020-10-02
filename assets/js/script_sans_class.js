window.onload = () => {
    // constants
    //  elements container
    const player = document.querySelector("#player");
    const lifeNbElement = document.querySelector("#life-count");
    const bombNbElement = document.querySelector("#bomb-count");
    const container = document.querySelector("#game-container");
    const foesNbElement = document.querySelector("#foe-count");
    const levelNbElement = document.querySelector("#level-count");
    //  game parameters
    const levelToBeginId = "begin-time"; // identifier for the count down between each level
    const offset = 50; // pixel size for 1 square
    const maxOffset = 700; // maximun pixel size offset for elements
    const foesDelay = 500; // delay in miliseconds between each foe movement
    const collisionDelay = 500; // delay in miliseconds between each player blink
    const collisionDuration = 4000; // duration in miliseconds for the player blink action
    const collisionClass = "collision"; // CSS class for the player blink action
    const bombDelay = 3000; // delay in miliseconds before the explosion of the bomb
    const hitLifeCount = 1; // number of life to remove in the life counter
    const foesClass = "tracker"; // CSS class for foe element
    const bombClass = "bomb"; // CSS class for bomb element
    const wallClass = "wall"; // CSS class for wall element
    const initialX = 400; // initial horizontal player position in pixel
    const initialY = 400; // initial vertical player position in pixel
    const startClearZone = 2; // number of grid square for the clear zone arround the player at the start
    const explosionRadius = 2; // number of grid square for the explosion radius
    const explosionClass = "explosion"; // CSS class for bomb element at the explosion
    const bombBlinkClass = "bomb-blink"; // CSS class for bomb element when it blink
    const bombBlinkInterval = 500; // delay in miliseconds between each bomb blink
    const sameHit = false; // to avoid ( false ) or not ( true ) the counting of the same hit when a player move at the same time and position than a foe
    const maxLevel = 5; // maximum number of level
    const levelDifficultyIncrementationFoe = 1; // number of foe element add at each level
    const levelDifficultyIncrementationBomb = 1; // number of bomb available add at each level
    const levelDifficultyIncrementationLife = 1; // number of life available add at each level
    const levelTimeToBegin = 5; // delay in seconds before next level start
    const beginLevel = 1; // level to begin the game
    const baseFoeNumber = 10; // number of foe element at the begining
    const baseBombNumber = 10; // number of bomb available at the begining
    const baseLifeNumber = 10; // number of life available at the begining
    // variables
    let currentLevel = beginLevel;
    let bombMaxCount = baseBombNumber;
    let lifeMaxCount = baseLifeNumber;
    let foesMaxCount = baseFoeNumber;
    let inGame = false;
    let bombCount = bombMaxCount;
    let lifeCount = lifeMaxCount;
    let foesCount = foesMaxCount;
    let foesArray = [];
    let bombsArray = [];
    let timeoutArray = [];
    let intervalArray = [];
    let hitsArray = [];

    /*function addZero(val, n) {
        if(isNaN(val)==false) {
            while(val.toString().length < n) {
                val = "0" + val;
            }
        }
        return val;
    }*/
    // function which return the integer value of the element property passed in parameter
    function getPos(object,property) {
        return parseInt(window.getComputedStyle(object).getPropertyValue(property).replace("px",""));
    }
    // function which return a array with the player position in the shape of (Y,X)
    function getPlayerPos() {
        //if(typeof(player)==="undefined" || player===null) {console.log("player "+player);}
        return [getPos(player,"top"),getPos(player,"left")];
    }
    // function which return a boolean if the player is detect or not in the explosion radius ( for bomb action )
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
    // function which return a array with the foe(s) detect in the explosion radius ( for bomb action )
    function detectFoesInRadius(valY,valX) {
        let indexArray = [];
        for(let pos = 0; pos <= foesArray.length-1; pos++) {
            let foe = foesArray[pos];
            let el = container.querySelector("#"+foe[0]);
            //if(typeof(el)==="undefined" || el===null) {console.log("detectFoesInRadius "+el);}
            let elY = getPos(el,"top"); 
            let elX = getPos(el,"left"); 
            if(elY>=valY-(explosionRadius*offset) && elY<=valY+(explosionRadius*offset) && elX>=valX-(explosionRadius*offset) && elX<=valX+(explosionRadius*offset)) {
                indexArray.push(pos);
            }
        }
        return indexArray;
    }
    // procedure for deleting foe(s) when one or many foes are detect in the explosion radius ( for bonb action )
    function deleteFoesInRadius(foesInRadius) {
        if(foesInRadius.length>0) {
            let indexDown = 0;
            foesInRadius.forEach(index => {
                let indexUpdate = index-indexDown;
                //console.log("indexUpdate = "+indexUpdate+"; index = "+index+"; indexDown = "+indexDown+"   "+typeof(foesArray[indexUpdate]));
                clearInterval(foesArray[indexUpdate][1]);
                let el = container.querySelector("#"+foesArray[indexUpdate][0]);
                el.remove();
                foesArray.splice(indexUpdate,1);
                foesCount--;
                indexDown++;
            });
            foesNbElement.innerText = foesCount;
        }
    }
    // procedure when a bomb is release in the game
    function bombAction(indexInArray,valY,valX) {
        let bomb = container.querySelector("#"+bombsArray[indexInArray]);
        let interval = setInterval(() => {
            bomb.classList.toggle(bombBlinkClass);
        }, bombBlinkInterval);
        intervalArray.push(interval);
        let fId = setTimeout(() => {
            let indexI = intervalArray.indexOf(interval);
            intervalArray.splice(indexI,1);
            clearInterval(interval);
            bomb.classList.remove(bombBlinkClass);
            bomb.classList.remove(bombClass);
            bomb.classList.add(explosionClass);
            bomb.style.top = valY;
            bomb.style.left = valX;
            let scale = 1+(explosionRadius*2);
            bomb.style.transform = "scale("+scale+")";
            let foesInRadiusA = detectFoesInRadius(valY,valX);
            let playerInRadiusA = detectPlayerInRadius(valY,valX);
            if(playerInRadiusA) {
                collisionAction(true);
            }
            let fIdBis = setTimeout(() => {
                let foesInRadiusB = detectFoesInRadius(valY,valX);
                let playerInRadiusB = detectPlayerInRadius(valY,valX);
                let foesInRadius = foesInRadiusA;
                foesInRadiusB.forEach(item => foesInRadius.includes(item) ? null : foesInRadius.push(item));
                deleteFoesInRadius(foesInRadius);
                bomb.remove();
                bombsArray.splice(indexInArray,1);
                let indexB = timeoutArray.indexOf(fIdBis);
                timeoutArray.splice(indexB,1);
                if(playerInRadiusB==true && playerInRadiusA==false) {
                    collisionAction(true);
                }
                if(foesCount==0 && lifeCount>0) {
                    gameWin();
                }
                else if(bombCount==0 || lifeCount==0) {
                    gameFail();
                }
            }, 300);
            timeoutArray.push(fIdBis);
            let indexT = timeoutArray.indexOf(fId); 
            timeoutArray.splice(indexT,1);
        }, bombDelay);
        timeoutArray.push(fId);
    }
    // procedure when a collision is detect
    function collisionAction(minusLife) {
        player.classList.remove(collisionClass);
        let intervalCollision = setInterval(() => {
            player.classList.toggle(collisionClass);
        }, collisionDelay);
        intervalArray.push(intervalCollision);
        let fId = setTimeout(() => {
            let indexI = intervalArray.indexOf(intervalCollision);
            intervalArray.splice(indexI,1);
            clearInterval(intervalCollision);
            player.classList.remove(collisionClass);
            let indexT = timeoutArray.indexOf(fId);
            timeoutArray.splice(indexT,1);
        }, collisionDuration);
        timeoutArray.push(fId);
        if(minusLife) {
            lifeCount -= hitLifeCount;
            lifeNbElement.innerText = lifeCount;
        }
    }
    // function which return a boolean if a collision is detect or not between the player and a foe ( for foe and player movement )
    function testCollision(foe) {
        let playerPos = getPlayerPos();
        let val = false;
        if(foe!==null && typeof(foe)!=='undefined') {
            //if(typeof(foe)==="undefined" || foe===null) {console.log("testCollision 1 "+foe);}
            let tempY = getPos(foe,"top");
            let tempX = getPos(foe,"left");
            if(tempY==playerPos[0] && tempX==playerPos[1]) {
                val = true;
                let d = new Date(); 
                let time = d.getTime().toString(); time = parseInt(time);
                hitsArray.push([foe.id,time]);
            }
        }
        else {
            let d = new Date(); 
            let time = d.getTime().toString(); time = parseInt(time);
            foesArray.forEach(div => {
                let tempEl = container.querySelector("#"+div[0]);
                //if(typeof(tempEl)==="undefined" || tempEl===null) {console.log("testCollision All "+tempEl);}
                let tempY = getPos(tempEl,"top");
                let tempX = getPos(tempEl,"left");
                if(tempY==playerPos[0] && tempX==playerPos[1]) {
                    val = true;
                    hitsArray.push([div[0],time]);
                }
            });
        }
        return val;
    }
    // procedure for stoping animation ( like movement )
    function stopAnimation() {
        foesArray.forEach(foe => {
            clearInterval(foe[1]);
        });
        player.classList.remove(collisionClass);
        let lenI = intervalArray.length;
        for(let i = 0; i <= lenI-1; i++) {
            if(typeof(intervalArray[i])!=='undefined') {
                clearInterval(intervalArray[i]);
            }
        }
        let lenT = timeoutArray.length;
        for(let j = 0; j <= lenT-1; j++) {
            if(typeof(timeoutArray[j])!=='undefined') {
                clearTimeout(timeoutArray[j]);
            }
        }
    }
    // procedure to go in the next level
    function nextLevel() {
        let el = document.createElement("div");
        el.classList.add("bandeau-class");
        el.id = "bandeau";
        el.innerHTML = '<p>LEVEL WIN</p><p>Vous avez gagné le niveau '+currentLevel+' !</p><p>Prochain niveau dans <span id="begin-time">'+levelTimeToBegin+'</span> secondes !</p>';
        container.appendChild(el);
        let interval = setInterval(() => {
            let levelToBeginElement = document.querySelector("#"+levelToBeginId);
            let time = parseInt(levelToBeginElement.innerText)-1; if(time<0) { time = 0; }
            levelToBeginElement.innerText = time;
        }, 1000);
        intervalArray.push(interval);
        let timeout = setTimeout(() => {
            let indexI = intervalArray.indexOf(interval);
            intervalArray.splice(indexI,1);
            clearInterval(interval);
            currentLevel++;
            init(currentLevel);
            generatedElements("foe");
            inGame = true;
            foesInMovement();
            let indexT = timeoutArray.indexOf(timeout);
            timeoutArray.splice(indexT,1);
        }, (levelTimeToBegin*1000));
        timeoutArray.push(timeout);
    }
    // procedure when the game is lose
    function gameFail() {
        inGame = false;
        stopAnimation();
        let el = document.createElement("div"); 
        el.classList.add("bandeau-class");
        el.id = "bandeau";
        el.innerHTML = "<p>GAME OVER</p><p>Vous avez perdu !</p>";
        container.appendChild(el);
    }
    // procedure execute when the game is won
    function gameWin() {
        inGame = false;
        stopAnimation();
        if(currentLevel<maxLevel) {
            nextLevel();
        }
        else {
            let el = document.createElement("div");
            el.classList.add("bandeau-class");
            el.id = "bandeau";
            el.innerHTML = "<p>GAME WIN</p><p>Vous avez gagné le jeux après "+maxLevel+" niveaux gagnés !</p>";
            container.appendChild(el);
        }
    }
    // function which return a boolean if a bomb element is already or not at the same position ( when bomb is release )
    function testBombPosExist(elY,elX) {
        let val = false;
        if(bombsArray.length>0) {
            //console.log("1: "+bombsArray[bombsArray.length-1][0]+" "+bombsArray);
            let tempEl = container.querySelector("#"+bombsArray[bombsArray.length-1][0]);
            //if(typeof(tempEl)==="undefined" || tempEl===null) {console.log("testBombPosExist "+tempEl+" "+typeof(bombsArray[bombsArray.length-1][0])+" bombsArray "+bombsArray);}
            if(typeof(tempEl)!=="undefined" && tempEl!==null) {
                let tempY = getPos(tempEl,"top");
                let tempX = getPos(tempEl,"left");
                if(tempY==elY && tempX==elX) {
                    val = true;
                }
            }
        }
        return val;
    }
    // procedure which excecute action coresponding to the key code passed in parameter
    function gameAction(keyCode)
    {
        let playerPos = getPlayerPos();
        let newPosition = playerPos;
        if(lifeCount>=0) {
            let hitDown = true;
            let d = new Date();
            let time = d.getTime().toString(); time = parseInt(time);
            switch(keyCode) {
                case "ArrowUp":
                    if(playerPos[0]>=offset) {
                        newPosition[0] -= offset;
                        player.style.top = newPosition[0]+"px";
                        let samePos = testCollision();
                        if(samePos) {
                            if(sameHit==false && hitsArray.length>1) {
                                if((hitsArray[hitsArray.length-2][1]+foesDelay)>hitsArray[hitsArray.length-1][1] && hitsArray[hitsArray.length-1][0]==hitsArray[hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(lifeCount>0) {
                                collisionAction(hitDown);
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
                            if(sameHit==false && hitsArray.length>1) {
                                if((hitsArray[hitsArray.length-2][1]+foesDelay)>hitsArray[hitsArray.length-1][1] && hitsArray[hitsArray.length-1][0]==hitsArray[hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(lifeCount>0) {
                                collisionAction(hitDown);
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
                            if(sameHit==false && hitsArray.length>1) {
                                if((hitsArray[hitsArray.length-2][1]+foesDelay)>hitsArray[hitsArray.length-1][1] && hitsArray[hitsArray.length-1][0]==hitsArray[hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(lifeCount>0) {
                                collisionAction(hitDown);
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
                            if(sameHit==false && hitsArray.length>1) {
                                if((hitsArray[hitsArray.length-2][1]+foesDelay)>hitsArray[hitsArray.length-1][1] && hitsArray[hitsArray.length-1][0]==hitsArray[hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(lifeCount>0) {
                                collisionAction(hitDown);
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
                            el.id = "bomb"+((baseBombNumber-bombCount)+1);
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
    // function which return a random number between one and the maximum number of elements for the grid game ( for positioning generated elements )
    function getRandomIntInclusive() {
        let min = 1;
        let max = Math.floor((maxOffset+offset)/offset);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
    // function which return a boolean if a element is in the player zone or at the same position ( for generate elements ) 
    function testPosPlayer(elY,elX) {
        let val = false;
        if(elY>=initialY-(startClearZone*offset) && elY<=initialY+(startClearZone*offset) && elX>=initialX-(startClearZone*offset) && elX<=initialX+(startClearZone*offset)) {
            val = true;
        }
        return val;
    }
    // function which return a boolean if a element reach or not the border of the game zone ( for all moving elements )
    function testDirPosFoe(elY,elX,dir) {
        let val = false;
        if(dir!="none" && dir!="") {
            foesArray.forEach(div => {
                let tempEl = container.querySelector("#"+div[0]);
                //if(typeof(tempEl)==="undefined" || tempEl===null) {console.log("testDirPosFoe "+tempEl);}
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
            });
        }
        return val;
    }
    // function which return a boolean if a foe element exit or not at the position generated ( for initialisation )
    function testFoePosExist(elY,elX) {
        let val = false;
        foesArray.forEach(div => {
            let tempEl = container.querySelector("#"+div[0]);
            //if(typeof(tempEl)==="undefined" || tempEl===null) {console.log("testFoePosExist "+tempEl);}
            let tempY = getPos(tempEl,"top");
            let tempX = getPos(tempEl,"left");
            if(tempY==elY && tempX==elX) {
                val = true;
            }
        });
        return val;
    }
    // function which return a random string directory for foes elements ( for foes movement )
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
    // procedure for moving foes elements in the game ( lauch at the start and for each level )
    function foesInMovement() {
        foesArray.forEach(div => {
            let intervalRef = setInterval(() => {
                let el = container.querySelector("#"+div[0]);
                //if(typeof(el)==="undefined" || el===null) {console.log("testFoePosExist "+el);}
                let offsetY = 0; let valY = getPos(el,"top");
                let offsetX = 0; let valX = getPos(el,"left");
                let dir = getFoesDirection(valY,valX);
                let collisionWall = testDirPosFoe(valY,valX,dir);
                while(collisionWall) {
                    dir = getFoesDirection(valY,valX);
                    collisionWall = testDirPosFoe(valY,valX,dir);
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
                    let hitDown = true;
                    if(sameHit==false && hitsArray.length>1) {
                        if((hitsArray[hitsArray.length-2][1]+foesDelay)>hitsArray[hitsArray.length-1][1] && div[0]==hitsArray[hitsArray.length-2][0]) {
                            hitDown = false;
                        }
                    }
                    if(lifeCount>0) {
                        collisionAction(hitDown);
                    }
                    else {
                        gameFail();
                    } 
                }
            }, foesDelay);
            div.push(intervalRef);
        });
    }
    // procedure to initialize variables and elements ( for next level and start game )
    function init(level) {
        inGame = false;
        if(typeof(level)==="number" && Number.isInteger(level)) {
            currentLevel = level;
            bombMaxCount = baseBombNumber+((currentLevel-1)*levelDifficultyIncrementationBomb);
            lifeMaxCount = baseLifeNumber+((currentLevel-1)*levelDifficultyIncrementationLife);
            foesMaxCount = baseFoeNumber+((currentLevel-1)*levelDifficultyIncrementationFoe);
        }
        else {
            currentLevel = beginLevel;
            bombMaxCount = baseBombNumber;
            lifeMaxCount = baseLifeNumber;
            foesMaxCount = baseFoeNumber;
        }
        bombCount = bombMaxCount;
        lifeCount = lifeMaxCount;
        foesCount = foesMaxCount;
        foesArray = [];
        bombsArray = [];
        timeoutArray = [];
        intervalArray = [];
        hitsArray = [];
        player.style.top = initialY+"px";
        player.style.left = initialX+"px";
        lifeNbElement.innerText = lifeCount;
        bombNbElement.innerText = bombCount;
        levelNbElement.innerText = currentLevel;
        foesNbElement.innerText = foesCount;
        document.querySelector(".game-table-container > p:last-of-type").style.visibility = "visible";
        let oldEl = container.querySelectorAll("div."+foesClass+",div."+bombClass+",div."+wallClass);
        oldEl.forEach(div => {
            div.remove();
        });
        let msg = container.querySelector("#bandeau");
        if(typeof(msg)!=='undefined') {
            container.querySelector("#bandeau").remove(); 
        }
    }
    // procedure to generate elements in the game with a good positioning
    function generatedElements(typeEl) {
        switch(typeEl) {
            case "foe":
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
            break;
            case "wall":

            break;
            default:
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
        }
    }
    // procedure to start the game
    function startGame() {
        init();
        generatedElements("foe");
        inGame = true;
        foesInMovement();
    }
    // key listener
    window.addEventListener("keydown", event => {
        if(event.code=="Digit0" || event.code=="Numpad0") {
            startGame();
        }
        else if(inGame) {
            gameAction(event.code);
        }
    });
};