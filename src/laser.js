import Phaser from 'phaser'


export default class Laser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, dir, group) {
        super(scene, x, y, 'laser');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setScale(2,1)
        this.setDepth(1);

        this.group = group
        this.completeVisible = false

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
    }

    initLaser(){
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
    }

    powerOff(){
        this.body.checkCollision.none = true
        this.group.killAndHide(this)
    }

}