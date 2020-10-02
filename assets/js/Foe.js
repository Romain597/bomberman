export default class Foe extends Game {
    #xValue = 0;
    #yValue = 0;
    #elementId = "";
    #elementStyleClass = "";
    #intervalRef = null;
    #foeElement = null;
    constructor(xVal,yVal,idVal,styleClassName) {
        this.#xValue = xVal;
        this.#yValue = yVal;
        this.#elementId = "#"+idVal;
        this.#elementStyleClass = styleClassName;
        // create element
        this.#foeElement = document.createElement("div"); 
        this.#foeElement.classList.add(this.#elementStyleClass);
        this.#foeElement.id = idVal;
        this.#foeElement.style.top = yVal+"px";
        this.#foeElement.style.left = xVal+"px";
        super.#container.appendChild(this.#foeElement);
    }
    /*static addElement(n,x,y) {
        let el = document.createElement("div"); 
        el.classList.add(this.#elementStyleClass);
        el.id = "foe"+n;
        el.style.top = y+"px";
        el.style.left = x+"px";
        super.#container.appendChild(el);
    }*/
    getPos() {
        return {x:this.#xValue,y:this.#yValue};
    }
    #setPos(x,y) {
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
        return this.#foeElement;
    }
    getIntervalRef() {
        return this.#intervalRef;
    }
    #getDirection(valY,valX) {
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
            else if(valY>=super.#maxOffset && dir=="bottom") {
                dir = "top";
            }
            else if(valX>=super.#maxOffset && dir=="left") {
                dir = "right";
            }
            else if(valX<=0 && dir=="right") {
                dir = "left";
            }
        }
        return dir;
    }
    #testDirPos(elY,elX,dir) {
        let val = false;
        if(dir!="none" && dir!="") {
            super.#foesArray.forEach(foeObj => {
                let pos = foeObj.getPos();
                let tempY = pos.y;
                let tempX = pos.x;
                if(dir=="all") {
                    if((elY-super.#offset==tempY && elX==tempX) || (elY+super.#offset==tempY && elX==tempX) || (elX-super.#offset==tempX && elY==tempY) || (elX+super.#offset==tempX && elY==tempY)) {
                        val = true;
                    }
                }
                else if(dir=="top") {
                    if(elY-super.#offset==tempY && elX==tempX) {
                        val = true;
                    }
                }
                else if(dir=="bottom") {
                    if(elY+super.#offset==tempY && elX==tempX) {
                        val = true;
                    }
                }
                else if(dir=="right") {
                    if(elX-super.#offset==tempX && elY==tempY) {
                        val = true;
                    }
                }
                else if(dir=="left") {
                    if(elX+super.#offset==tempX && elY==tempY) {
                        val = true;
                    }
                }
            });
        }
        return val;
    }
    move() {
        this.#intervalRef = setInterval(() => {
            let offsetY = 0; let valY = this.#yValue;
            let offsetX = 0; let valX = this.#xValue;
            let dir = this.#getDirection(valY,valX);
            let collisionWall = this.#testDirPos(valY,valX,dir);
            while(collisionWall) {
                dir = this.#getDirection(valY,valX);
                collisionWall = this.#testDirPos(valY,valX,dir);
            }
            switch(dir) {
                case "top":
                    offsetY -= super.#offset;
                break;
                case "bottom":
                    offsetY += super.#offset;
                break;
                case "right":
                    offsetX -= super.#offset; 
                break;
                case "left":
                    offsetX += super.#offset; 
                break;
            }
            valY = (valY+offsetY);
            valX = (valX+offsetX);
            this.#foeElement.style.top = valY+"px";
            this.#foeElement.style.left = valX+"px";
            this.#setPos(valX,valY);
            let samePos = super.#testCollision(el);
            if(samePos) {
                let hitDown = true;
                if(super.#sameHit==false && super.#hitsArray.length>1) {
                    if((super.#hitsArray[super.#hitsArray.length-2][1]+super.#foesDelay)>super.#hitsArray[super.#hitsArray.length-1][1] && div[0]==super.#hitsArray[super.#hitsArray.length-2][0]) {
                        hitDown = false;
                    }
                }
                if(super.#lifeCount>0) {
                    super.#collisionAction(hitDown);
                }
                else {
                    super.#gameFail();
                } 
            }
        }, super.#foesDelay);
    }
    delete() {
        clearInterval(this.#intervalRef);
        super.#container.querySelector(this.#elementId).remove();
        super.#foesCount--;
        return super.#foesArray.indexOf(this);
    }
}