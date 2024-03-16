
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
        this.actualPickUp;

        //Provisional
        this.label = this.scene.add.text(10, 10, "").setDepth(2);
        this.labelNota = this.scene.add.text(10, 60, "").setDepth(2);
        this.updateScore()
    }

    assignObjectsToCap() {
        this.objectsDict = {
            [PUNTUACION.D]: { texture: 'spritesheet_d', frames: 7 },
            [PUNTUACION.C]: { texture: 'spritesheet_c', frames: 8 },
            [PUNTUACION.B]: { texture: 'spritesheet_b', frames: 12 },
            [PUNTUACION.A]: { texture: 'spritesheet_a', frames: 8 },
            [PUNTUACION.S]: { texture: 'spritesheet_s', frames: 10 },
        }
    }

    addPoints(points) {
        const newScore = this.score + points;
        if (this.currentMark === PUNTUACION.F && newScore >= PUNTUACION.D) {
            this.score = PUNTUACION.D
            this.passUpCap(PUNTUACION.D)

        } else if (this.currentMark === PUNTUACION.D && newScore >= PUNTUACION.C) {
            this.score = PUNTUACION.C
            this.passUpCap(PUNTUACION.C)

        } else if (this.currentMark === PUNTUACION.C && newScore >= PUNTUACION.B) {
            this.score = PUNTUACION.B
            this.passUpCap(PUNTUACION.B)

        } else if (this.currentMark === PUNTUACION.B && newScore >= PUNTUACION.A) {
            this.score = PUNTUACION.A
            this.passUpCap(PUNTUACION.A)

        } else if (this.currentMark === PUNTUACION.A && newScore >= PUNTUACION.S) {
            this.score = PUNTUACION.S
            this.passUpCap(PUNTUACION.S)

        } else {
            this.score += points
        }
        this.updateScore()

    }

    reduceScore(points) {
        const newScore = this.score / points;
        if (this.currentMark === PUNTUACION.D && newScore <= PUNTUACION.D) {
            this.currentMark = PUNTUACION.F
        } else if (this.currentMark === PUNTUACION.C && newScore <= PUNTUACION.C) {
            this.currentMark = PUNTUACION.D
        } else if (this.currentMark === PUNTUACION.B && newScore <= PUNTUACION.B) {
            this.currentMark = PUNTUACION.C
        } else if (this.currentMark === PUNTUACION.A && newScore <= PUNTUACION.A) {
            this.currentMark = PUNTUACION.B
        } else if (this.currentMark === PUNTUACION.S && newScore <= PUNTUACION.S) {
            this.currentMark = PUNTUACION.A
        }
        this.score -= points;
        this.passDownCap()
        this.updateScore()
    }

    passUpCap(newMark) {
        this.actualPickUp = new PickUp(this.scene, 100, 100, this.objectsDict[newMark].texture, this.objectsDict[newMark].frames, newMark)
    }

    passDownCap() {
        if(this.actualPickUp)
        {
            this.actualPickUp.destroy()
        }
    }

    updateScore() {
        this.label.text = 'Score: ' + this.score;
        this.labelNota.text = 'Score: ' + this.currentMark;

    }

}