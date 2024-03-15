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
            frames: this.scene.anims.generateFrameNumbers('teacher', { start: 0, end: 3 }),
            frameRate: 9
        });

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        this.graphics = scene.add.graphics();

        //Who to shoot
        this.target = player
        //Propiedades enemy
        this.body.allowGravity = false;
        
        //Estados jugador
        this.isShooting = false
        
        //Player data
        this.cooldown = 0.5
        // this.speed = 400;

          // Llama al método shootRay cuando sea necesario
          this.timerEvent = scene.time.addEvent({ delay: 3000, callback: this.shoot, callbackScope: this, loop: true });
    }

    shoot()
    {

        this.play('teacher_shoot');
        // Dibuja una línea desde el enemigo hasta el jugador
        this.graphics.lineStyle(2, 0xff0000);
        this.graphics.beginPath();
        this.graphics.moveTo(this.x, this.y);
        this.graphics.lineTo(this.target.x, this.target.y);
        this.graphics.strokePath();

        // Elimina la línea después de un tiempo
        this.scene.time.delayedCall(1500, () => {
            this.graphics.clear();
        });
        
    }
    
    
    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
    
    
            
}
