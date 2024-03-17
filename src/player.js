import Phaser from 'phaser'
import ScoreManager from './scoreManager';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Player extends Phaser.GameObjects.Sprite {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        const idleAnimation = this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('player', {start: 0, end: 4}),
            frameRate: 10,
            repeat: -1
        });

        const walkDownAnimation = this.scene.anims.create({
            key: 'walk_down',
            frames: this.scene.anims.generateFrameNumbers('player', {start: 5, end: 9}),
            frameRate: 10,
            repeat: -1
        });

        const idleUpAnimation = this.scene.anims.create({
            key: 'idle_up',
            frames: this.scene.anims.generateFrameNumbers('player', {start: 10, end: 14}),
            frameRate: 10,
            repeat: -1
        });

        const walkUpAnimation = this.scene.anims.create({
            key: 'walk_up',
            frames: this.scene.anims.generateFrameNumbers('player', {start: 15, end: 19}),
            frameRate: 10,
            repeat: -1
        });

        const idleSideAnimation = this.scene.anims.create({
            key: 'idle_side',
            frames: this.scene.anims.generateFrameNumbers('player', {start: 20, end: 24}),
            frameRate: 10,
            repeat: -1
        });

        const walkSideAnimation = this.scene.anims.create({
            key: 'walk_side',
            frames: this.scene.anims.generateFrameNumbers('player', {start: 25, end: 29}),
            frameRate: 10,
            repeat: -1
        });

        const dashAnimation = this.scene.anims.create({
            key: 'dash',
            frames: this.scene.anims.generateFrameNumbers('player_dash', {start: 0, end: 2}),
            frameRate: 6,
            repeat: 0
        });

        this.on('animationcomplete', end => {
            if (this.anims.currentAnim.key === 'dash'){
                this.isDashing = false;
            }
        });
        
        this.play('idle');
        this.lastDirection = new Phaser.Math.Vector2(0,1);

        this.score = 5;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        this.bodyOffsetWidth = this.body.width / 3.6;
        this.bodyOffsetHeight = this.body.height / 5;
        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.body.width / 2.2;
        this.body.height = this.body.height / 1.5;

        //Propiedades player
        this.body.allowGravity = false;

        //Keys
        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W ,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Estados jugador
        this.isDashing = false
        this.canDash = true
        this.isInmune = false
        this.isTakePoints = false

        //Player data
        this.dashSpeed = 350
        this.speed = 250;
        this.dashCooldownTime = 2000;
        this.timerDash = 0
        this.invulnerabiltyDuration = 1000
        this.cooldownPoints = 2000

        //Choose controls
        this.handleControls()
        this.controls = this.keyboardControls
        //If gamepad controls

        this.scoreManager = new ScoreManager(scene,this)

    }

    handleControls() {
        this.keyboardControls = {
            movementControl: () => {
                let direction = new Phaser.Math.Vector2();

                if (this.cursors.up.isDown) {
                    direction.y -= 1;
                    if(!this.cursors.left.isDown && !this.cursors.right.isDown){
                        this.play('walk_up', true);
                    }
                }
                else if (this.cursors.down.isDown) {
                    direction.y += 1;
                    if(!this.cursors.left.isDown && !this.cursors.right.isDown){
                        this.play('walk_down', true);
                    }
                }
                if (this.cursors.left.isDown) {
                    direction.x -= 1;
                    this.play('walk_side', true).setFlipX(true);
                }
                else if (this.cursors.right.isDown) {
                    direction.x += 1;
                    this.play('walk_side', true).setFlipX(false);
                }
                
                if(this.body.velocity.x === 0 && this.body.velocity.y === 0 && !this.isDashing){
                    if(direction.y !== 0){
                        this.lastDirection = direction;
                    }else{
                        if(this.lastDirection.y > 0){
                            this.play('idle', true);
                        }else{
                            this.play('idle_up', true);
                        }
                    }
                }

                direction.normalize();
                this.body.setVelocity(direction.x * this.speed, direction.y * this.speed)
            },

            dashControl: () => {
                if (Phaser.Input.Keyboard.JustDown(this.keySpace) && this.canDash) {
                    this.initDash();
                    this.scene.sound.add("dash_sound", {
                        volume: 0.85,
                        loop: false
                    }).play();
                    this.play('dash', true);
                }
            },

            // pauseGame: () => {

            // }
        }
    }

    dashLaser(score)
    {
        if(!this.isTakePoints)
        {
            this.isTakePoints = true
            this.scoreManager.addPoints(score)
            this.scene.time.delayedCall(this.cooldownPoints, ()=> {
                this.isTakePoints = false
            })
        }
    }


    hitPlayer(dmg) {
        if(!this.isInmune)
        {
            this.scoreManager.reduceScore(dmg)
            this.isInmune = true;
            this.scene.tweens.add({
                targets: this,
                alpha: {from:1, to: 0},
                duration: this.invulnerabiltyDuration,
                loop: 1,
                ease: 'Sine.easeInSine',
                yoyo: true,
                onComplete: ()=>{
                    this.isInmune = false
    
                }
            })
        }
    }



    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if(!this.canDash){
            this.timerDash += dt
            if(this.timerDash >= this.dashCooldownTime) {
                this.canDash = true
                this.timerDash = 0;

            }
        }
        if (!this.isDashing) {
            this.controls.movementControl();
            this.controls.dashControl()

        }
    }


    initDash() {
        this.canDash = false
        let dashDirection = new Phaser.Math.Vector2(this.body.velocity.x, this.body.velocity.y);
        dashDirection.normalize();

        this.body.setVelocity(dashDirection.x * this.dashSpeed, dashDirection.y * this.dashSpeed);

        // Cooldown del dash, deberiamos ponerlo como variable
        this.isDashing = true;
    }

}
