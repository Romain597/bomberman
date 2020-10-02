export default class Bomb extends Game {
    #xValue = 0;
    #yValue = 0;
    #elementId = "";
    #elementStyleClass = "";
    constructor(xVal,yVal,idVal,styleClassName) {
        this.#xValue = xVal;
        this.#yValue = yVal;
        this.#elementId = "#"+idVal;
        this.#elementStyleClass = styleClassName;
        // create element
        this.#bombElement = document.createElement("div");
        this.#bombElement.classList.add(this.#elementStyleClass);
        this.#bombElement.id = idVal;
        this.#bombElement.style.top = yVal+"px";
        this.#bombElement.style.left = xVal+"px";
        this.container.appendChild(this.#bombElement);
    }
    getPos() {
        return {x:this.#xValue,y:this.#yValue};
    }
    /*#setPos(x,y) {
        this.#xValue = x;
        this.#yValue = y;
    }*/
    getId() {
        return this.#elementId;
    }
    getStyleClassName() {
        return this.#elementStyleClass;
    }
    getHtmlElement() {
        return this.#bombElement;
    }
    explode(indexInArray,valY,valX) {
        let interval = setInterval(() => {
            this.#bombElement.classList.toggle(bombBlinkClass);
        }, bombBlinkInterval);
        intervalArray.push(interval);
        let fId = setTimeout(() => {
            let indexI = intervalArray.indexOf(interval);
            intervalArray.splice(indexI,1);
            clearInterval(interval);
            this.#bombElement.classList.remove(bombBlinkClass);
            this.#bombElement.classList.remove(bombClass);
            this.#bombElement.classList.add(explosionClass);
            this.#bombElement.style.top = valY;
            this.#bombElement.style.left = valX;
            let scale = 1+(explosionRadius*2);
            this.#bombElement.style.transform = "scale("+scale+")";
            let foesInRadiusA = detectFoesInRadius(valY,valX);
            let playerInRadiusA = detectPlayerInRadius(valY,valX);
            if(playerInRadiusA) {
                super.#playerObj.collision(true);
            }
            let fIdBis = setTimeout(() => {
                let foesInRadiusB = detectFoesInRadius(valY,valX);
                let playerInRadiusB = detectPlayerInRadius(valY,valX);
                let foesInRadius = foesInRadiusA;
                foesInRadiusB.forEach(item => foesInRadius.includes(item) ? null : foesInRadius.push(item));
                super.#deleteFoesInRadius(foesInRadius);
                this.#bombElement.remove();
                //bombsArray.splice(indexInArray,1);
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
}