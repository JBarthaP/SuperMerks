
// MANAGER DE PUNTUACION

import PickUp from "./pickup";

export const PUNTUACION = {
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
        this.score = 90
        this.currentMark = PUNTUACION.F
        this.numberHitsInF = 0
        this.assignObjectsToCap()
        this.assignTextures()
        this.actualPickUp;
        this.positionsPickUps = [
            new Phaser.Math.Vector2(200, 100),
            new Phaser.Math.Vector2(900, 100),
            new Phaser.Math.Vector2(100, 500),
            new Phaser.Math.Vector2(1154 / 2, 640 / 2),
            new Phaser.Math.Vector2(900, 500)]

        //Provisional
        // this.label = this.scene.add.text(10, 10, "").setDepth(2);
        // this.labelNota = this.scene.add.text(10, 60, "").setDepth(2);
        this.markExam = this.scene.add.sprite(100, 50, this.marksDict[this.currentMark]).setDepth(2)
        this.spritesheet_a = this.scene.add.sprite(155, 100, "spritesheet_a").setDepth(2); this.spritesheet_a.setScale(0.3); this.spritesheet_a.setVisible(false)
        this.spritesheet_b = this.scene.add.sprite(120, 105, "spritesheet_b").setDepth(2); this.spritesheet_b.setScale(0.5); this.spritesheet_b.setVisible(false)
        this.spritesheet_c = this.scene.add.sprite(80, 105, "spritesheet_c").setDepth(2); this.spritesheet_c.setScale(0.5); this.spritesheet_c.setVisible(false)
        this.spritesheet_d = this.scene.add.sprite(40, 105, "spritesheet_d").setDepth(2); this.spritesheet_d.setScale(0.5); this.spritesheet_d.setVisible(false)
        // 40 70 100 135 170
        this.updateScore()

        this.pickUpDict = {
            spritesheet_d: false,
            spritesheet_c: false,
            spritesheet_b: false,
            spritesheet_a: false
        }
    }

    assignTextures() {
        this.marksDict = {
            [PUNTUACION.F]: 'nota_f',
            [PUNTUACION.D]: 'nota_d',
            [PUNTUACION.C]: 'nota_c',
            [PUNTUACION.B]: 'nota_b',
            [PUNTUACION.A]: 'nota_a',
            [PUNTUACION.S]: 'nota_s'
        }
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

    updatePickUpList(pickupid) {

        this.pickUpDict[pickupid] = true;
        if (this.pickUpDict["spritesheet_d"]) {
            this.spritesheet_d.setVisible(true);
        }
        if (this.pickUpDict["spritesheet_c"]) {
            this.spritesheet_c.setVisible(true);
        }
        if (this.pickUpDict["spritesheet_b"]) {
            this.spritesheet_b.setVisible(true);
        }
        if (this.pickUpDict["spritesheet_a"]) {
            this.spritesheet_a.setVisible(true);
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

        } else if (this.currentMark === PUNTUACION.S) {
            this.score = PUNTUACION.S
        } else {
            this.score += points
        }
        this.updateScore()

    }

    reduceScore(points) {
        const newScore = this.score - points;
        if (newScore !== 0) {

            if (this.currentMark === PUNTUACION.D && newScore <= PUNTUACION.D) {
                this.currentMark = PUNTUACION.F
                this.spritesheet_d.setVisible(false);
                this.pickUpDict["spritesheet_d"] = false;
            } else if (this.currentMark === PUNTUACION.C && newScore <= PUNTUACION.C) {
                this.currentMark = PUNTUACION.D
                this.spritesheet_c.setVisible(false);
                this.pickUpDict["spritesheet_c"] = false;
            } else if (this.currentMark === PUNTUACION.B && newScore <= PUNTUACION.B) {
                this.currentMark = PUNTUACION.C
                this.spritesheet_b.setVisible(false);
                this.pickUpDict["spritesheet_b"] = false;
            } else if (this.currentMark === PUNTUACION.A && newScore <= PUNTUACION.A) {
                this.currentMark = PUNTUACION.B
                this.spritesheet_a.setVisible(false);
                this.pickUpDict["spritesheet_a"] = false;
            } else if (this.currentMark === PUNTUACION.S && newScore <= PUNTUACION.S) {
                this.currentMark = PUNTUACION.A
            }
            this.score -= points;
        }
        else {
            this.lose()
        }
        this.passDownCap()
        this.updateScore()
    }

    passUpCap(newMark) {
        if (typeof this.actualPickUp === 'undefined') {
            const positionToSpawn = this.calculatePositionPickUp()
            this.actualPickUp = new PickUp(this.scene, positionToSpawn.x, positionToSpawn.y, this.objectsDict[newMark].texture, this.objectsDict[newMark].frames, newMark)
        }
    }

    passDownCap() {
        if (this.actualPickUp) {
            this.actualPickUp.destroy()
            this.actualPickUp = undefined
        }
    }

    updateScore() {
        // this.label.text = 'Score: ' + this.score;
        // this.labelNota.text = 'Score: ' + this.currentMark;
        this.markExam.setTexture(this.marksDict[this.currentMark])
    }

    calculatePositionPickUp() {
        const distances = [];
        for (const vector of this.positionsPickUps) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, vector.x, vector.y);
            distances.push({ vector, distance });
        }

        distances.sort((a, b) => a.distance - b.distance);

        const closestVectors = distances.slice(0, 3);

        const randomIndex = Phaser.Math.Between(0, 2);
        const selectedVector = closestVectors[randomIndex].vector;
        return selectedVector;
    }

    win() {
        this.player.win()
    }

    lose() {
        this.player.die()
    }

}