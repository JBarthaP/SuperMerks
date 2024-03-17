import Phaser from 'phaser'


export default class Laser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, dir, group, shooter) {
        super(scene, x, y, 'laser');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.speed = 40
        this.dir = dir

        this.setScale(2,1)
        this.setDepth(1);

        this.group = group
        this.completeVisible = false
        this.damage = 1
        this.scoreDodge = 2

        this.shooter = shooter

        this.scene.anims.create({
            key: 'laseranim',
            frames: this.scene.anims.generateFrameNumbers('lasersprite', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        });


        this.scene.anims.create({
            key: 'laseranimvert',
            frames: this.scene.anims.generateFrameNumbers('laserspritever', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        });

        if(dir){
            this.play('laseranimvert', true)
            // this.setRotation(Phaser.Math.DegToRad(90))
            // console.log("ROTACION")
            // console.log(this.body.rotation)
            // this.body.rotation = 90
            this.body.setSize(10)
            this.setScale(1,2)

            // console.log(this.body.rotation)
            // this.body.setRotation(Phaser.Math.DegToRad(90))
            
        }else{
            this.play('laseranim', true)
            this.body.setSize(547)
            this.body.setOffset(1, 0)
        }

        this.direction = new Phaser.Math.Vector2();

        if(this.dir){
            this.direction.x += 1;
        }else{
            this.direction.y += 1;
        }
        this.isMoving = false;   
    }

    initLaser(moving){
        this.shooter.shoot(this, moving)
    }

    trigger(moving) {
        this.scene.sound.add('laser_sound', {
            volume: 0.5,
            loop: false
        }).play();
        this.despawn = this.scene.time.addEvent({
			delay: 5000,
			callback: this.powerOff,
			callbackScope: this,
            // startAt: 1000
		});

        this.scene.tweens.add({
            targets: this,
            alpha: {from:1, to: 0},
            duration: 500,
            loop: 1,
            ease: 'Sine.easeInSine',
            yoyo: true,
            onComplete: ()=>{
                this.completeVisible = true
            }
        })

        this.setActive(true);
        this.setVisible(true);
        this.body.checkCollision.none = false
        if(moving){
            this.scene.sound.add('laser_beam', {
                volume: 0.30,
                loop: false
            }).play();
            this.moveLaser()
            this.shooter.moveShooter()
        }
    }

    powerOff(){
        this.body.checkCollision.none = true
        this.group.killAndHide(this)
        this.shooter.anims.stop('shooterdown', true);
        this.shooter.play('shooterdefault', true);
        this.body.setVelocity(0, 0);
        this.isMoving = false;   
        this.completeVisible = false
        this.shooter.stopShooter();
    }

    moveLaser(){
        this.isMoving = true;   
        this.body.setVelocity(this.direction.x * this.speed, this.direction.y * this.speed)
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);
        if(this.dir){
            if(this.x >= 900){
                this.direction.x = -1;
            }else if(this.x <= 300){
                this.direction.x = 1;
            }
            if(this.isMoving){
                this.moveLaser();
            }
        }else{
            if(this.y >= 450){
                this.direction.y = -1;
            }else if(this.y <= 100){
                this.direction.y = 1;
            }
            if(this.isMoving){
                this.moveLaser();
            }
        }
    }

}