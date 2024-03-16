import Phaser from 'phaser'
import Bullet from './bullet';

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

        //Estados jugador
        this.isShooting = false

        //Player data
        this.cooldown = 0
        this.cooldownDuration = 6000;
        // this.speed = 400;

        //Bullets
        this.bulletSpeed = 0.4

        this.targetPoint = new Phaser.Math.Vector2()

        if(this.x > this.scene.scale.width/2)
        {
            this.setFlipX(true)
        }
        // Llama al método shootRay cuando sea necesario
        //this.timerEvent = scene.time.addEvent({ delay: 3000, callback: this.shoot, callbackScope: this, loop: true });
    }

    shoot() {
        this.play('teacher_shoot');
        this.scene.sound.add("mondongo", {
            volume: 0.15,
            loop: false
        }).play();
        const direction = new Phaser.Math.Vector2(this.targetPoint.x - this.x, this.targetPoint.y - this.y).normalize();
        const bullet = new Bullet(this.scene, this.x, this.y, direction, this.bulletSpeed, this.player);
        
    }
    
    
    ramdomCoords(max, min){
        let x = 0
        let y = 0;

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
        
        this.cooldown -= dt;

        if (this.cooldown <= 0) {
            const coords = this.getCoordsPlayer()
            this.targetPoint.set(coords.x, coords.y)
            this.shoot();
            this.cooldown = this.cooldownDuration; 
        }
    }

}
