import Game from 'Game.js';
import Player from 'Player.js';
import Foe from 'Foe.js';
import Wall from 'Wall.js';
import Bomb from 'Bomb.js';
import {addZero} from 'functions.js';

let data = {
    idContainerEl:"game-container",
    idPlayer:"player",
    idLifeNbEl:"life-count",
    idBombNbEl:"bomb-count",
    idFoeNbEl:"foe-count",
    idLevelNbEl:"level-count",
    idLevelToBeginTimeEl:"begin-time",
    nOffset:50,
    nMaxOffset:700,
    nFoesDelay:500,
    nCollisionDelay:500,
    nCollisionDuration:4000,
    sCollisionClass:"collision",
    sPlayerClass:"player-class",
    nBombDelay:3000,
    nHitLifeCount:1,
    sFoesClass:"tracker",
    sBombClass:"bomb",
    sWallClass:"wall",
    nInitialX:400,
    nInitialY:400,
    nStartClearZone:2,
    nExplosionRadius:2,
    sExplosionClass:"explosion",
    sBombBlinkClass:"bomb-blink",
    nBombBlinkInterval:500,
    bSameHit:false,
    nMaxLevel:5,
    nLevelDifficultyIncrementationFoe:1,
    nLevelDifficultyIncrementationBomb:1,
    nLevelDifficultyIncrementationLife:1,
    nLevelTimeToBegin:5,
    nBeginLevel:1,
    nBaseFoeNumber:10,
    nBaseBombNumber:10,
    nBaseLifeNumber:10
}

// key listener
window.addEventListener("keydown", event => {
    if(event.code=="Digit0" || event.code=="Numpad0") {
        //startGame();
    }
    else if(inGame) {
        //gameAction(event.code);
    }
});