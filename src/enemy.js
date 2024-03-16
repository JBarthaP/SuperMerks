import Phaser from 'phaser'

/**
 * Clase que representa el enemigo del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Enemy extends Phaser.GameObjects.Sprite {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y, player) {
        super(scene, x, y, 'enemy');

        const shootAnimation = this.scene.anims.create({
            key: 'teacher_shoot',
            frames: this.scene.anims.generateFrameNumbers('teacher', { start: 0, end: 2 }),
            frameRate: 9
        });

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(1);

        //Who to shoot
        this.target = player
        //Propiedades enemy
        this.body.allowGravity = false;

        //Estados jugador
        this.isShooting = false
        this.isShootingCooldown = false

        //Player data
        this.cooldown = 0.5
        // this.speed = 400;

        //Rays anims
        this.progressLine = 0
        this.durationToReach = 1500
        this.startPoint = new Phaser.Math.Vector2(this.x, this.y)
        this.targetPoint = new Phaser.Math.Vector2()

        // Llama al método shootRay cuando sea necesario
        this.timerEvent = scene.time.addEvent({ delay: 3000, callback: this.shoot, callbackScope: this, loop: true });
    }

    shoot(dt) {

        this.play('teacher_shoot');
        // Dibuja una línea desde el enemigo hasta el jugador
        this.graphics.clear()
        this.graphics.lineStyle(4, 0xff0000);
        this.graphics.beginPath();
        this.graphics.moveTo(this.x, this.y);

        //Esto lo hize yo (pablo) pero cambienlo
        // const progressPoint = Phaser.Math.LinearXY(this.startPoint, this.targetPoint, this.progressLine);
        // this.graphics.lineTo(progressPoint.x, progressPoint.y)
        const coords = this.getCoordsPlayer()
        this.graphics.lineTo(coords.x, coords.y);
        this.graphics.strokePath();

        this.progressLine += dt / this.durationToReach
        // Elimina la línea después de un tiempo
        if (this.progressLine >= 1) {
            this.graphics.clear()
            this.progressLine = 0
            this.isShooting = false
        }

        // this.scene.sound.add("mondongo", {
        //     volume: 0.15,
        //     loop: false
        // }).play();

    }

    getCoordsPlayer() {
        const xCoord = this.target.x;
        const yCoord = this.target.y;
        const xOffset = Phaser.Math.Between(-100, 100);
        const yOffset = Phaser.Math.Between(-100, 100);

        const targetPos = new Phaser.Math.Vector2(xCoord + xOffset, yCoord + yOffset);

        return targetPos;
    }


    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (!this.isShooting) {
            const coords = this.getCoordsPlayer()
            this.targetPoint.set(coords.x, coords.y)
            this.isShooting = true
            this.shoot(dt)
        }
        // else {
        //     this.shoot(dt)
        // }

    }



}
