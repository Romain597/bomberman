export default class Wall extends Game {
    #xValue = 0;
    #yValue = 0;
    #elementId = "";
    #elementStyleClass = "";
    constructor(divEl,x,y,id,styleClassName) {
        this.#xValue = x;
        this.#yValue = y;
        this.#wallElement = divEl;
        this.#elementId = "#"+id;
        this.#elementStyleClass = styleClassName;
    }
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
        return this.#wallElement;
    }
}