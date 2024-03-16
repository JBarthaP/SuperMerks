
// MANAGER DE PUNTUACION

import PickUp from "./pickup";

const PUNTUACION = {
    F: 0,
    D: 40,
    C: 50,
    B: 70,
    A: 90,
    S: 100
  };

export default class ScoreManager {

    constructor(scene, player) {
        this.scene = scene
        this.player = player
        this.score = 30
        this.currentMark = PUNTUACION.F 
        this.numberHitsInF = 0
        this.assignObjectsToCap() 
       
        //Provisional
        this.label = this.scene.add.text(10, 10, "").setDepth(2);
        this.labelNota = this.scene.add.text(10,60, "").setDepth(2);
        this.updateScore()
    }

    assignObjectsToCap()
    {
        this.objectsDict = {
            [PUNTUACION.D]: 'placeholder',
            [PUNTUACION.C]: 'placeholder',
            [PUNTUACION.B]: 'placeholder',
            [PUNTUACION.A]: 'placeholder',
            [PUNTUACION.S]: 'placeholder',
        }
    }

    addPoints(points)
    {
        const newScore = this.score + points;
        if(this.currentMark === PUNTUACION.F && newScore >= PUNTUACION.D)
        {
            this.score = PUNTUACION.D
            this.passUpCap(PUNTUACION.D)

        } else if(this.currentMark === PUNTUACION.D && newScore >= PUNTUACION.C)
        {
            this.score = PUNTUACION.C
            this.passUpCap(PUNTUACION.C)

        } else if(this.currentMark === PUNTUACION.C && newScore >= PUNTUACION.B)
        {
            this.score = PUNTUACION.B
            this.passUpCap(PUNTUACION.B)

        } else if(this.currentMark === PUNTUACION.B && newScore >= PUNTUACION.A)
        {
            this.score = PUNTUACION.A
            this.passUpCap(PUNTUACION.A)

        } else if(this.currentMark === PUNTUACION.A && newScore >= PUNTUACION.S)
        {
            this.score = PUNTUACION.S
            this.passUpCap(PUNTUACION.S)

        } else {
            this.score += points
        } 
        this.updateScore()

    }

    reduceScore(points)
    {
        this.score -= points;
        this.updateScore()
    }

    passUpCap(newMark)
    {
        const pickUp = new PickUp(this.scene,100,100,this.objectsDict[newMark], newMark)
    }

    passDownCap()
    {

    }

    updateScore() {
        this.label.text = 'Score: ' + this.score;
        this.labelNota.text = 'Score: ' + this.currentMark;

    }

    generateCapObject()
    {

    }


}