import Phaser from 'phaser'


export default class PickUp extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, sprite, mark) {
        super(scene, x, y, sprite);
        this.scene = scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true);
        this.mark = mark
    }

    /**
     * Redefinición del preUpdate de Phaser
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.scene.physics.overlap(this.scene.player, this)) {
            this.scene.player.scoreManager.currentMark = this.mark
            this.scene.player.scoreManager.updateScore()
            this.destroy();
        }
    }
}
