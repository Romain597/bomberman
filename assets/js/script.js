window.onload = () => {
    const player = document.getElementById("player");
    const lifeNbElement = document.getElementById("life-count");
    const offset = 50;
    const lifeCount = 10;
    const foesCount = 10;
    const maxOffset = 750;
    const foesDelay = 500;
    const bombCount = 1000;
    const bombDelay = 3;
    const hitLifeCount = 1;
    var hit = false;
    var inGame = false;
    var playerPos = [0,0];
    var foesArray = [];

    function getPlayerPos() {
        return [parseInt(window.getComputedStyle(player).getPropertyValue("top")),parseInt(window.getComputedStyle(player).getPropertyValue("left"))];
    }
    function gameAction(keyCode)
    {
        let currentPos = playerPos; //getPlayerPos();
        let newPosition = currentPos;
        switch(keyCode) {
            case "ArrowUp":
                if(currentPos[0]>=offset) {
                    newPosition[0] -= offset;
                    player.style.top = newPosition[0]+"px";
                }
            break;
            case "ArrowDown":
                if(currentPos[0]<=(maxOffset-offset)) {
                    newPosition[0] += offset;
                    player.style.top = newPosition[0]+"px";
                }
            break;
            case "ArrowLeft":
                if(currentPos[1]>=offset) {
                    newPosition[1] -= offset;
                    player.style.left = newPosition[1]+"px";
                }
            break;
            case "ArrowRight":
                if(currentPos[1]<=(maxOffset-offset)) {
                    newPosition[1] += offset;
                    player.style.left = newPosition[1]+"px";
                }
            break;
            case "Space":
            
            break;
        }
        return newPosition;
    }
    function getRandomIntInclusive() {
        let min = 1;
        let max = Math.floor((maxOffset+offset)/50);
        return Math.ceil(Math.random() * (max - min +1)) + min;
    }
    function startGame() {
        playerPos = [0,0];
        player.style.top = playerPos[0]+"px";
        player.style.left = playerPos[1]+"px";
        lifeNbElement.innerText(lifeCount);
        for(let i = 0;i<=foesCount;i++) {
           let x = (getRandomIntInclusive()-1)*offset;
           let y = (getRandomIntInclusive()-1)*offset;
           //foesArray
           
        }
    }

    window.addEventListener("keyup", event => {
        //console.log(event.code); console.log(inGame);
        if(event.code=="Digit0" || event.code=="Numpad0") {
            if(inGame) {
                
            }
            inGame = true;
        }
        else if(inGame) { // event.code=="ArrowUp" || event.code=="ArrowDown" || event.code=="ArrowLeft" || event.code=="ArrowRight" || event.code=="Space"
            playerPos = gameAction(event.code);
            //console.log("playerPos "+playerPos);
        }
    });
};