import Phaser from 'phaser'

export default class Shooter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, dir) {
        super(scene, x, y, 'shooter');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(1);

        this.scene.anims.create({
            key: 'shooterdown',
            frames: this.scene.anims.generateFrameNumbers('shooter', {start: 0, end: 2 }),
            frameRate: 3
        })

        this.scene.anims.create({
            key: 'shooterright',
            frames: this.scene.anims.generateFrameNumbers('shooter', {start: 3, end: 5 }),
            frameRate: 3
        })

        this.scene.anims.create({
            key: 'shooterup',
            frames: this.scene.anims.generateFrameNumbers('shooter', {start: 6, end: 8 }),
            frameRate: 3
        })

        this.scene.anims.create({
            key: 'shooterleft',
            frames: this.scene.anims.generateFrameNumbers('shooter', {start: 9, end: 11}),
            frameRate: 3
        })

        if (dir === 'left') {
            this.play('shooterleft', true);
        }
        else if (dir === 'right') {
            this.play('shooterright', true);
        }
        else if (dir === 'top') {
            this.play('shooterup', true);
        }
        else {
            this.play('shooterdown', true);
        }
   
    }

    
    
   
}