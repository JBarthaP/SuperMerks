import Phaser from 'phaser'

export default class Shooter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, dir, laser) {
        super(scene, x, y, 'shooter');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(1);

        this.laser = laser
        this.dir = dir
        
        this.scene.anims.create({
            key: 'shooterdown',
            frames: this.scene.anims.generateFrameNumbers('shooter', {start: 0, end: 2 }),
            frameRate: 1
        })

        this.scene.anims.create({
            key: 'shooterright',
            frames: this.scene.anims.generateFrameNumbers('shooter', {start: 3, end: 5 }),
            frameRate: 1
        })

        this.scene.anims.create({
            key: 'shooterup',
            frames: this.scene.anims.generateFrameNumbers('shooter', {start: 6, end: 8 }),
            frameRate: 1
        })

        this.scene.anims.create({
            key: 'shooterleft',
            frames: this.scene.anims.generateFrameNumbers('shooter', {start: 9, end: 11}),
            frameRate: 1
        })

        this.scene.anims.create({
            key: 'shooterdefault',
            frames: this.scene.anims.generateFrameNumbers('shooter', {start: 0, end: 0}),
            frameRate: 1
        })
   
    }

    shoot(laser) {
        this.play('shooterdown', true);
        this.on('animationcomplete', end => {
            if (this.anims.currentAnim.key === 'shooterdown') {
                laser.trigger()
            }
        });
    }
   
}