export default class Player extends Game {
    #xValue = 0;
    #yValue = 0;
    #elementId = "";
    #elementStyleClass = "";
    #nbLevel = 0;
    #nbLife = 0;
    constructor(xVal,yVal,idVal,styleClassName,nLevel,nLife) {
        this.#xValue = xVal;
        this.#yValue = yVal;
        this.#playerElement = super.#playerElement;
        this.#elementId = "#"+idVal;
        this.#elementStyleClass = styleClassName;
        this.#nbLevel = nLevel;
        this.#nbLife = nLife;
    }
    /*static addPlayer() {

    }*/
    getPos() {
        return {x:this.#xValue,y:this.#yValue};
    }
    setPos(x,y) {
        this.#xValue = x;
        this.#yValue = y;
    }
    getId() {
        return this.#elementId;
    }
    getStyleClassName() {
        return this.#elementStyleClass;
    }
    getHtmlElement() {
        return this.#playerElement;
    }
    getLevel() {
        return this.#nbLevel;
    }
    setLevel(n) {
        this.#nbLevel = n;
    }
    getLife() {
        return this.#nbLifel;
    }
    /*setLife(n) {
        this.#nbLife = n;
    }*/
    move() {
        
    }
    collision(lifeCount = true) {
        this.#playerElement.classList.remove(this.#elementStyleClass);
        let intervalCollision = setInterval(() => {
            this.#playerElement.classList.toggle(this.#elementStyleClass);
        }, super.#collisionDelay);
        super.#intervalArray.push(intervalCollision);
        let fId = setTimeout(() => {
            let indexI = super.#intervalArray.indexOf(intervalCollision);
            super.#intervalArray.splice(indexI,1);
            clearInterval(intervalCollision);
            this.#playerElement.classList.remove(this.#elementStyleClass);
            let indexT = super.#timeoutArray.indexOf(fId);
            super.#timeoutArray.splice(indexT,1);
        }, super.#collisionDuration);
        super.#timeoutArray.push(fId);
        if(lifeCount) {
            this.#updateLife();
        }
    }
    #updateLife() {
        this.#nbLife -= super.#hitLifeCount;
        super.#lifeNbElement.innerText = this.#nbLife;
    }
    move(keyCode) {
        let playerPos = this.getPos();
        let newPosition = playerPos;
        if(super.#lifeCount>=0) {
            let hitDown = true;
            let d = new Date();
            let time = d.getTime().toString(); time = parseInt(time);
            switch(keyCode) {
                case "ArrowUp":
                    if(playerPos.y>=super.#offset) {
                        newPosition.y -= super.#offset;
                        playerElement.style.top = newPosition.y+"px";
                        let samePos = super.#testCollision();
                        if(samePos) {
                            if(super.#sameHit==false && super.#hitsArray.length>1) {
                                if((super.#hitsArray[super.#hitsArray.length-2][1]+super.#foesDelay)>super.#hitsArray[super.#hitsArray.length-1][1] && super.#hitsArray[super.#hitsArray.length-1][0]==super.#hitsArray[super.#hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(super.#lifeCount>0) {
                                this.#collision(hitDown);
                            }
                            else {
                                super.#gameFail();
                            }                       
                        }
                    }
                break;
                case "ArrowDown":
                    if(playerPos.y<=(super.#maxOffset-super.#offset)) {
                        newPosition.y += super.#offset;
                        playerElement.style.top = newPosition.y+"px";
                        let samePos = super.#testCollision();
                        if(samePos) {
                            if(super.#sameHit==false && super.#hitsArray.length>1) {
                                if((super.#hitsArray[super.#hitsArray.length-2][1]+super.#foesDelay)>super.#hitsArray[super.#hitsArray.length-1][1] && super.#hitsArray[super.#hitsArray.length-1][0]==super.#hitsArray[super.#hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(super.#lifeCount>0) {
                                this.#collision(hitDown);
                            }
                            else {
                                super.#gameFail();
                            }                       
                        }
                    }
                break;
                case "ArrowLeft":
                    if(playerPos.x>=super.#offset) {
                        newPosition.x -= super.#offset;
                        playerElement.style.left = newPosition.x+"px";
                        let samePos = super.#testCollision();
                        if(samePos) {
                            if(super.#sameHit==false && super.#hitsArray.length>1) {
                                if((super.#hitsArray[super.#hitsArray.length-2][1]+super.#foesDelay)>super.#hitsArray[super.#hitsArray.length-1][1] && super.#hitsArray[super.#hitsArray.length-1][0]==super.#hitsArray[super.#hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(super.#lifeCount>0) {
                                this.#collision(hitDown);
                            }
                            else {
                                super.#gameFail();
                            }                       
                        }
                    }
                break;
                case "ArrowRight":
                    if(playerPos.x<=(super.#maxOffset-super.#offset)) {
                        newPosition.x += super.#offset;
                        playerElement.style.left = newPosition.x+"px";
                        let samePos = super.#testCollision();
                        if(samePos) {
                            if(super.#sameHit==false && super.#hitsArray.length>1) {
                                if((super.#hitsArray[super.#hitsArray.length-2][1]+super.#foesDelay)>super.#hitsArray[super.#hitsArray.length-1][1] && super.#hitsArray[super.#hitsArray.length-1][0]==super.#hitsArray[super.#hitsArray.length-2][0]) {
                                    hitDown = false;
                                }
                            }
                            if(super.#lifeCount>0) {
                                this.#collision(hitDown);
                            }
                            else {
                                super.#gameFail();
                            }                       
                        }
                    }
                break;
                case "Space":
                    if(super.#bombCount>0) {
                        if(super.#testBombPosExist(playerPos.y,playerPos.x)==false) {
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