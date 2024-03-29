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
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        const walkDownAnimation = this.scene.anims.create({
            key: 'walk_down',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 5, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        const idleUpAnimation = this.scene.anims.create({
            key: 'idle_up',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 10, end: 14 }),
            frameRate: 10,
            repeat: -1
        });

        const walkUpAnimation = this.scene.anims.create({
            key: 'walk_up',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 15, end: 19 }),
            frameRate: 10,
            repeat: -1
        });

        const idleSideAnimation = this.scene.anims.create({
            key: 'idle_side',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 20, end: 24 }),
            frameRate: 10,
            repeat: -1
        });

        const walkSideAnimation = this.scene.anims.create({
            key: 'walk_side',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 25, end: 29 }),
            frameRate: 10,
            repeat: -1
        });

        const dashAnimation = this.scene.anims.create({
            key: 'dash',
            frames: this.scene.anims.generateFrameNumbers('player_dash', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        const attackAnimation = this.scene.anims.create({
            key: 'playerAttackSide',
            frames: this.scene.anims.generateFrameNumbers('playerextra', { start: 165, end: 167 }),
            frameRate: 6,
            repeat: 0
        });

        const attackAnimationDown = this.scene.anims.create({
            key: 'playerAttackDown',
            frames: this.scene.anims.generateFrameNumbers('playerextra', { start: 30, end: 32 }),
            frameRate: 6,
            repeat: 0
        });

        const attackAnimationUp = this.scene.anims.create({
            key: 'playerAttackUp',
            frames: this.scene.anims.generateFrameNumbers('playerextra', { start: 105, end: 107 }),
            frameRate: 6,
            repeat: 0
        });

        this.on('animationcomplete', end => {
            console.log("ACABA UNA ANIMACION", this.anims.currentAnim.key)

            if (this.anims.currentAnim.key === 'dash') {
                this.isDashing = false;
            }

            if (this.anims.currentAnim.key === 'playerAttackUp' || this.anims.currentAnim.key === 'playerAttackDown'
                || this.anims.currentAnim.key === 'playerAttackSide') {
                console.log("ANIMACION DE ATTACK Acabada")
                this.isAttacking = false
                this.body.setSize(this.defaultSize.width, this.defaultSize.height);
            }
        });

        this.play('idle_side');
        this.lastDirection = new Phaser.Math.Vector2(0, 1);

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
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            k: Phaser.Input.Keyboard.KeyCodes.ENTER
        })
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Gamepad controls

        //Estados jugador
        this.isDashing = false
        this.canDash = true
        this.isInmune = false
        this.isTakePoints = false
        this.isAttacking = false;

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
        this.scene.input.gamepad.on(Phaser.Input.Gamepad.Events.BUTTON_DOWN, () => { this.controls = this.gamepadControls; });
        // this.scene.input.gamepad.once('connected', function (pad) {
        //     this.controls = this.gamepadControls
        // }, this);  
        this.scene.input.keyboard.on('keydown', () => { this.controls = this.keyboardControls})      

        this.scoreManager = new ScoreManager(scene, this)
        this.defaultSize = {width: this.body.width, height: this.body.height};
    }

    handleControls() {
        this.keyboardControls = {
            movementControl: () => {
                let direction = new Phaser.Math.Vector2();

                if (this.cursors.up.isDown) {
                    direction.y -= 1;
                    if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.isAttacking) {
                        this.play('walk_up', true);
                    }
                }
                else if (this.cursors.down.isDown) {
                    direction.y += 1;
                    if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.isAttacking) {
                        this.play('walk_down', true);
                    }
                }
                if (this.cursors.left.isDown) {
                    direction.x -= 1;
                    if(!this.isAttacking){
                        this.play('walk_side', true).setFlipX(true);
                    }
                }
                else if (this.cursors.right.isDown) {
                    direction.x += 1;
                    if(!this.isAttacking){
                        this.play('walk_side', true).setFlipX(false);
                    }
                }

                if (this.body.velocity.x === 0 && this.body.velocity.y === 0 && !this.isDashing) {
                    if (direction.y !== 0) {
                        this.lastDirection = direction;
                    } else {
                        if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.isAttacking) {
                            if (this.lastDirection.y > 0) {
                                this.play('idle', true);
                            } else {
                                this.play('idle_up', true);
                            }
                        }
                    }
                }

                if (this.cursors.k.isDown && !this.isAttacking) {
                    this.attack();
                }

                direction.normalize();
                this.body.setVelocity(direction.x * this.speed, direction.y * this.speed)
            },

            dashControl: () => {
                if (Phaser.Input.Keyboard.JustDown(this.keySpace) && this.canDash && !this.isAttacking) {
                    this.initDash();
                    this.scene.sound.add("dash_sound", {
                        volume: 0.15,
                        loop: false
                    }).play();
                    this.play('dash', true);
                }
            },

            // pauseGame: () => {

            // }
        }
        this.gamepadControls = {
            movementControl: () => {
                const pad = this.scene.input.gamepad.getPad(0);
                const dir = new Phaser.Math.Vector2(pad.leftStick.x, pad.leftStick.y);
                this.body.setVelocity(dir.normalize().scale(this.speed).x, dir.normalize().scale(this.speed).y);
                let direction = new Phaser.Math.Vector2();
                const up = pad.leftStick.y < 0
                const down = pad.leftStick.y > 0
                const left = pad.leftStick.x < 0
                const right = pad.leftStick.x > 0

                if (up) {
                    direction.y -= 1;
                    if (!left && !right && !this.isAttacking) {
                        this.play('walk_up', true);
                    }
                }
                else if (down) {
                    direction.y += 1;
                    if (!left && !right && !this.isAttacking) {
                        this.play('walk_down', true);
                    }
                }
                if (left) {
                    direction.x -= 1;
                    if(!this.isAttacking){
                        this.play('walk_side', true).setFlipX(true);
                    }
                }
                else if (right) {
                    direction.x += 1;
                    if(!this.isAttacking){
                        this.play('walk_side', true).setFlipX(false);
                    }
                }

                if (this.body.velocity.x === 0 && this.body.velocity.y === 0 && !this.isDashing) {
                    if (direction.y !== 0) {
                        this.lastDirection = direction;
                    } else {
                        if (!left && !right && !this.isAttacking) {
                            if (this.lastDirection.y > 0) {
                                this.play('idle', true);
                            } else {
                                this.play('idle_up', true);
                            }
                        }
                    }
                }

                if (pad.R1 && !this.isAttacking) {
                    this.attack();
                }

            },

            dashControl: () => {
                const pad = this.scene.input.gamepad.getPad(0);
                if (pad.A && this.canDash && !this.isAttacking) {
                    this.initDash();
                    this.scene.sound.add("dash_sound", {
                        volume: 0.15,
                        loop: false
                    }).play();
                    this.play('dash', true);
                }
            },
 
        }
    }

    dashLaser(score) {
        if (!this.isTakePoints) {
            this.isTakePoints = true
            this.scoreManager.addPoints(score)
            this.scene.time.delayedCall(this.cooldownPoints, () => {
                this.isTakePoints = false
            })
        }
    }


    hitPlayer(dmg) {
        if (!this.isInmune) {
            this.scoreManager.reduceScore(dmg)
            this.isInmune = true;
            this.scene.sound.add("damage_sound", {
                volume: 0.15,
                loop: false
            }).play();
            this.scene.tweens.add({
                targets: this,
                alpha: { from: 1, to: 0 },
                duration: this.invulnerabiltyDuration,
                loop: 1,
                ease: 'Sine.easeInSine',
                yoyo: true,
                onComplete: () => {
                    this.isInmune = false

                }
            })
        }
    }

    attack() {
        let direction = new Phaser.Math.Vector2(this.body.velocity.x, this.body.velocity.y);

        if (direction.x !== 0) {
            this.play('playerAttackSide', true)
            this.body.setSize(50, 42);
        } else if (direction.y > 0) {
            this.play('playerAttackDown', true)
            this.body.setSize(42, 60);

        } else if (direction.y < 0) {
            this.play('playerAttackUp', true)
            this.body.setSize(42, 60);
        } else {
            if (this.lastDirection.y < 0) {
                this.play('playerAttackUp', true)
                this.body.setSize(42, 60);
            } else {
                this.play('playerAttackDown', true)
                this.body.setSize(42, 60);

            }
        }

        this.isAttacking = true;

        this.scene.sound.add("bababooey", {
            volume: 0.15,
            loop: false
        }).play();
    }



    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        
        super.preUpdate(t, dt);
        if (!this.canDash) {
            this.timerDash += dt
            if (this.timerDash >= this.dashCooldownTime) {
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

    win() {
        this.scene.sound.stopAll()
        this.scene.scene.start('win')
    }

    die() {
        this.scene.sound.stopAll()
        this.scene.scene.start('lose')
    }

}
