import Star from './star.ts';
import Phaser from 'phaser'

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
            frameRate: 3,
            repeat: -1
        });
        
        this.play('idle');

        this.score = 0;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        // Esta label es la UI en la que pondremos la puntuación del jugador
        this.label = this.scene.add.text(10, 10, "");

        //Propiedades player
        this.body.allowGravity = false;

        //Keys
        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Estados jugador
        this.isDashing = false

        //Player data
        this.dashSpeed = 800
        this.speed = 400;

        //Choose controls
        this.handleControls()
        this.controls = this.keyboardControls
        //If gamepad controls

        this.updateScore();
    }

    handleControls() {
        this.keyboardControls = {
            movementControl: () => {
                let direction = new Phaser.Math.Vector2();

                if (this.cursors.up.isDown) {
                    direction.y -= 1;
                    this.play('walk_up', true);
                }
                else if (this.cursors.down.isDown) {
                    direction.y += 1;
                    this.play('walk_down', true);
                }
                else if (this.cursors.left.isDown) {
                    direction.x -= 1;
                    this.play('walk_side', true).setFlipX(true);
                }
                else if (this.cursors.right.isDown) {
                    direction.x += 1;
                    this.play('walk_side', true).setFlipX(false);
                }
                else {
                    this.play('idle', true);
                }
                direction.normalize();
                this.body.setVelocity(direction.x * this.speed, direction.y * this.speed)
            },

            dashControl: () => {
                if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
                    this.initDash();
                    this.play('dash', true);

                }
            },

            // pauseGame: () => {

            // }
        }
    }

    /**
     * El jugador ha recogido una estrella por lo que este método añade un punto y
     * actualiza la UI con la puntuación actual.
     */
    point() {
        this.score++;
        this.updateScore();
    }

    /**
     * Actualiza la UI con la puntuación actual
     */
    updateScore() {
        this.label.text = 'Score: ' + this.score;
    }

    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if (!this.isDashing) {
            this.controls.movementControl();
            this.controls.dashControl();
        }
    }


    initDash() {
        let dashDirection = new Phaser.Math.Vector2(this.body.velocity.x, this.body.velocity.y);
        dashDirection.normalize();

        this.body.setVelocity(dashDirection.x * this.dashSpeed, dashDirection.y * this.dashSpeed);

        // Cooldown del dash, deberiamos ponerlo como variable
        this.isDashing = true;
        this.scene.time.delayedCall(200, function () {
            this.isDashing = false;
        }, [], this);
    }

}
