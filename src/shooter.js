import Phaser from 'phaser'

export default class Shooter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, dir, laser) {
        super(scene, x, y, 'shooter');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(1);

        this.speed = 40;

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

        this.direction = new Phaser.Math.Vector2();
        this.isMoving = false;   

        if(this.dir ==='left' || this.dir ==='right'){
            this.direction.y += 1;
        }else{
            this.direction.x += 1;
        }
    }

    shoot(laser, moving) {
        this.play('shooterdown', true);
        this.on('animationcomplete', end => {
            if (this.anims.currentAnim.key === 'shooterdown') {
                laser.trigger(moving)
            }
        });
    }

    moveShooter(){
        this.isMoving = true;
        this.body.setVelocity(this.direction.x * this.speed, this.direction.y * this.speed)
    }

    stopShooter(){
        this.body.setVelocity(0,0);
        this.isMoving = false;
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);

        if(this.dir ==='left' || this.dir ==='right'){
            if(this.y >= 450){
                this.direction.y = -1;
            }else if(this.y <= 100){
                this.direction.y = 1;
            }
            if(this.isMoving){
                this.moveShooter();
            }
        }else{
            if(this.x >= 900){
                this.direction.x = -1;
            }else if(this.x <= 300){
                this.direction.x = 1;
            }
            if(this.isMoving){
                this.moveShooter();
            }
        }
    }
    
}