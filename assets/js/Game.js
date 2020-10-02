import Player from "./Player";
import Foe from "./Foe";

export default class Game {
    #currentLevel = 0;
    #bombMaxCount = 0;
    #lifeMaxCount = 0;
    #foesMaxCount = 0;
    #inGame = false;
    #bombCount = 0;
    #lifeCount = 0;
    #foesCount = 0;
    #foesArray = [];
    #bombsArray = [];
    #timeoutArray = [];
    #intervalArray = [];
    #hitsArray = [];
    #playerObj = {};
    #playerId = "";
    constructor(data) {
        // elements container
        this.#playerElement = document.querySelector("#"+data.idPlayer);
        this.#lifeNbElement = document.querySelector("#"+data.idLifeNbEl);
        this.#bombNbElement = document.querySelector("#"+data.idBombNbEl);
        this.#container = document.querySelector("#"+data.idContainerEl);
        this.#foesNbElement = document.querySelector("#"+data.idFoeNbEl);
        this.#levelNbElement = document.querySelector("#"+data.idLevelNbEl);
        // game parameters
        this.#playerId = data.idPlayer;
        this.#playerClass = data.sPlayerClass;
        this.#levelToBeginTimeElementId = data.idLevelToBeginTimeEl; // identifier for the count down between each level
        this.#offset = data.nOffset; // pixel size for 1 square
        this.#maxOffset = data.nMaxOffset; // maximun pixel size offset for elements
        this.#foesDelay = data.nFoesDelay; // delay in miliseconds between each foe movement
        this.#collisionDelay = data.nCollisionDelay; // delay in miliseconds between each player blink
        this.#collisionDuration = data.nCollisionDuration; // duration in miliseconds for the player blink action
        this.#collisionClass = data.sCollisionClass; // CSS class for the player blink action
        this.#bombDelay = data.nBombDelay; // delay in miliseconds before the explosion of the bomb
        this.#hitLifeCount = data.nHitLifeCount; // number of life to remove in the life counter
        this.#foesClass = data.sFoesClass; // CSS class for foe element
        this.#bombClass = data.sBombClass; // CSS class for bomb element
        this.#wallClass = data.sWallClass; // CSS class for wall element
        this.#initialX = data.nInitialX; // initial horizontal player position in pixel
        this.#initialY = data.nInitialY; // initial vertical player position in pixel
        this.#startClearZone = data.nStartClearZone; // number of grid square for the clear zone arround the player at the start
        this.#explosionRadius = data.nExplosionRadius; // number of grid square for the explosion radius
        this.#explosionClass = data.sExplosionClass; // CSS class for bomb element at the explosion
        this.#bombBlinkClass = data.sBombBlinkClass; // CSS class for bomb element when it blink
        this.#bombBlinkInterval = data.nBombBlinkInterval; // delay in miliseconds between each bomb blink
        this.#sameHit = data.bSameHit; // to avoid ( false ) or not ( true ) the counting of the same hit when a player move at the same time and position than a foe
        this.#maxLevel = data.nMaxLevel; // maximum number of level
        this.#levelDifficultyIncrementationFoe = data.nLevelDifficultyIncrementationFoe; // number of foe element add at each level
        this.#levelDifficultyIncrementationBomb = data.nLevelDifficultyIncrementationBomb; // number of bomb available add at each level
        this.#levelDifficultyIncrementationLife = data.nLevelDifficultyIncrementationLife; // number of life available add at each level
        this.#levelTimeToBegin = data.nLevelTimeToBegin; // delay in seconds before next level start
        this.#beginLevel = data.nBeginLevel; // level to begin the game
        this.#baseFoeNumber = data.nBaseFoeNumber; // number of foe element at the begining
        this.#baseBombNumber = data.nBaseBombNumber; // number of bomb available at the begining
        this.#baseLifeNumber = data.nBaseLifeNumber; // number of life available at the begining
        // variables
        this.#currentLevel = this.#beginLevel;
        this.#bombMaxCount = this.#baseBombNumber;
        this.#lifeMaxCount = this.#baseLifeNumber;
        this.#foesMaxCount = this.#baseFoeNumber;
        this.#bombCount = this.#bombMaxCount;
        this.#lifeCount = this.#lifeMaxCount;
        this.#foesCount = this.#foesMaxCount;
    }
    #initialisation(level) {
        this.#inGame = false;
        if(typeof(level)==="number" && Number.isInteger(level)) {
            this.#currentLevel = level;
            this.#bombMaxCount = this.#baseBombNumber+((this.#currentLevel-1)*this.#levelDifficultyIncrementationBomb);
            this.#lifeMaxCount = this.#baseLifeNumber+((this.#currentLevel-1)*this.#levelDifficultyIncrementationLife);
            this.#foesMaxCount = this.#baseFoeNumber+((this.#currentLevel-1)*this.#levelDifficultyIncrementationFoe);
        }
        else {
            this.#currentLevel = this.#beginLevel;
            this.#bombMaxCount = this.#baseBombNumber;
            this.#lifeMaxCount = this.#baseLifeNumber;
            this.#foesMaxCount = this.#baseFoeNumber;
        }
        this.#bombCount = this.#bombMaxCount;
        this.#lifeCount = this.#lifeMaxCount;
        this.#foesCount = this.#foesMaxCount;
        this.#foesArray = [];
        this.#bombsArray = [];
        this.#timeoutArray = [];
        this.#intervalArray = [];
        this.#hitsArray = [];
        this.#player.style.top = this.#initialY+"px";
        this.#player.style.left = this.#initialX+"px";
        this.#lifeNbElement.innerText = this.#lifeCount;
        this.#bombNbElement.innerText = this.#bombCount;
        this.#levelNbElement.innerText = this.#currentLevel;
        this.#foesNbElement.innerText = this.#foesCount;
        document.querySelector(".game-table-container > p:last-of-type").style.visibility = "visible";
        let oldEl = this.#container.querySelectorAll("div."+this.#foesClass+",div."+this.#bombClass+",div."+this.#wallClass);
        oldEl.forEach(div => {
            div.remove();
        });
        let msg = this.#container.querySelector("#bandeau");
        if(typeof(msg)!=='undefined') {
            this.#container.querySelector("#bandeau").remove(); 
        }
    }
    startGame() {
        this.#initialisation();
        this.#generateElements();
        this.#inGame = true;
        this.#beginMovement();
    }
    updateDisplay() {
        this.#lifeNbElement.innerText = this.#lifeCount;
        this.#bombNbElement.innerText = this.#bombCount;
        this.#levelNbElement.innerText = this.#currentLevel;
        this.#foesNbElement.innerText = this.#foesCount;
    }
    #getRandomIntInclusive() {
        let min = 1;
        let max = Math.floor((this.#maxOffset+this.#offset)/this.#offset);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
    #existFoePos(elY,elX) {
        let val = false;
        if(this.#foesArray.length>0) {
            this.#foesArray.forEach(foeObj => {
                let objPos = foeObj.getPos();
                let tempY = objPos.y;
                let tempX = objPos.x;
                if(tempY==elY && tempX==elX) {
                    val = true;
                }
            });
        }
        return val;
    }
    #testPosPlayer(elY,elX) {
        let val = false;
        if(elY>=this.#initialY-(this.#startClearZone*this.#offset) && elY<=this.#initialY+(this.#startClearZone*this.#offset) && elX>=this.#initialX-(this.#startClearZone*this.#offset) && elX<=this.#initialX+(this.#startClearZone*this.#offset)) {
            val = true;
        }
        return val;
    }
    #getRandomPosition() {
        let xVal = (this.#getRandomIntInclusive()-1)*this.#offset;
        let yVal = (this.#getRandomIntInclusive()-1)*this.#offset;
        while(this.#existFoePos(y,x) || this.#testPosPlayer(y,x)) {
            xVal = (this.#getRandomIntInclusive()-1)*this.#offset;
            yVal = (this.#getRandomIntInclusive()-1)*this.#offset;
        }
        return {x:xVal,y:yVal};
    }
    #generateElements() {
        // player
        this.#playerObj = new Player(this.#initialX,this.#initialY,this.#playerId,this.#playerClass,this.#currentLevel,this.#lifeCount);
        // foes
        for(let i = 1;i<=this.#foesCount;i++) {
            let pos = this.#getRandomPosition();
            let tempObj = new Foe(pos.x,pos.y,"foe"+i,this.#foesClass);
            this.#foesArray.push(tempObj);
        }
        // walls

    }
    #beginMovement() {
        // foes
        foesArray.forEach(tempObj => {
            tempObj.move();
        });
    }
    #nextLevel() {

    }
    #gameFail() {

    }
    #gameWin() {
        
    }
    #stopAnimation() {
        /*foesArray.forEach(foe => {
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
        }*/
    }
    #testCollision(foe) {
        /*let playerPos = getPlayerPos();
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
        return val;*/
    }
    #deleteFoesInRadius(foesInRadius) {
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
            this.updateDisplay();
        }
    }
    #gameAction(keyCode)
    {
        let playerPos = this.playerObj.getPos();
        let newPosition = playerPos;
        if(this.lifeCount>=0) {
            let hitDown = true;
            let d = new Date();
            let time = d.getTime().toString(); time = parseInt(time);
            switch(keyCode) {
                case "ArrowUp":
                    if(playerPos.y>=this.offset) {
                        newPosition.y -= this.offset;
                        player.style.top = newPosition.y+"px";
                        let samePos = this.testCollision();
                        if(samePos) {
                            if(this.sameHit==false && this.hitsArray.length>1) {
                                if((this.hitsArraythis.[hitsArray.length-2][1]+this.foesDelay)>this.hitsArray[this.hitsArray.length-1][1] && this.hitsArray[this.hitsArray.length-1][0]==this.hitsArray[this.hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(this.lifeCount>0) {
                                this.collisionAction(hitDown);
                            }
                            else {
                                this.gameFail();
                            }                       
                        }
                    }
                break;
                case "ArrowDown":
                    if(playerPos.y<=(this.maxOffset-this.offset)) {
                        newPosition.y += this.offset;
                        player.style.top = newPosition.y+"px";
                        let samePos = this.testCollision();
                        if(samePos) {
                            if(this.sameHit==false && this.hitsArray.length>1) {
                                if((this.hitsArraythis.[hitsArray.length-2][1]+this.foesDelay)>this.hitsArray[this.hitsArray.length-1][1] && this.hitsArray[this.hitsArray.length-1][0]==this.hitsArray[this.hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(this.lifeCount>0) {
                                this.collisionAction(hitDown);
                            }
                            else {
                                this.gameFail();
                            } 
                        }
                    }
                break;
                case "ArrowLeft":
                    if(playerPos.x>=this.offset) {
                        newPosition.x -= this.offset;
                        player.style.left = newPosition.x+"px";
                        let samePos = this.testCollision();
                        if(samePos) {
                            if(this.sameHit==false && this.hitsArray.length>1) {
                                if((this.hitsArraythis.[hitsArray.length-2][1]+this.foesDelay)>this.hitsArray[this.hitsArray.length-1][1] && this.hitsArray[this.hitsArray.length-1][0]==this.hitsArray[this.hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(this.lifeCount>0) {
                                this.collisionAction(hitDown);
                            }
                            else {
                                this.gameFail();
                            } 
                        }
                    }
                break;
                case "ArrowRight":
                    if(playerPos.x<=(this.maxOffset-this.offset)) {
                        newPosition.x += this.offset;
                        player.style.left = newPosition.x+"px";
                        let samePos = this.testCollision();
                        if(samePos) {
                            if(this.sameHit==false && this.hitsArray.length>1) {
                                if((this.hitsArraythis.[hitsArray.length-2][1]+this.foesDelay)>this.hitsArray[this.hitsArray.length-1][1] && this.hitsArray[this.hitsArray.length-1][0]==this.hitsArray[this.hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(this.lifeCount>0) {
                                this.collisionAction(hitDown);
                            }
                            else {
                                this.gameFail();
                            } 
                        }
                    }
                break;
                case "Space":
                    if(this.bombCount>0) {
                        if(this.testBombPosExist(playerPos.y,playerPos.x)==false) {
                            let el = document.createElement("div");
                            el.classList.add(this.bombClass);
                            el.id = "bomb"+((this.baseBombNumber-this.bombCount)+1);
                            el.style.top = playerPos.y+"px";
                            el.style.left = playerPos.x+"px";
                            this.container.appendChild(el);
                            this.bombsArray.push([el.id]);
                            let index = this.bombsArray.length-1;
                            this.bombCount--;
                            this.bombNbElement.innerText = this.bombCount;
                            this.bombAction(index,playerPos.y,playerPos.x);
                        }
                    }
                break;
            }
        }
    }
}