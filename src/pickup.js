import Phaser from 'phaser'
import { PUNTUACION } from './scoreManager';


export default class PickUp extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, sprite, frames, mark) {
        super(scene, x, y, sprite);
        this.scene = scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true);
        this.mark = mark
        this.spriteAux = sprite

        this.scene.anims.create({
            key: sprite,
            frames: this.scene.anims.generateFrameNumbers(sprite, { start: 0, end: frames - 1 }),
            frameRate: frames - 1,
            repeat: -1
        });

        this.play(sprite, true)
    }

    /**
     * Redefinición del preUpdate de Phaser
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.scene.physics.overlap(this.scene.player, this)) {
            this.scene.sound.add("collect_sound", {
                volume: 0.15,
                loop: false
            }).play();
            this.scene.player.scoreManager.currentMark = this.mark
            this.scene.player.scoreManager.updatePickUpList(this.spriteAux)
            this.scene.player.scoreManager.updateScore()
            if (this.mark === PUNTUACION.S) {
                this.scene.player.scoreManager.win()
            }
            this.destroy();
        }
    }
}
