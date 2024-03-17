import Platform from './platform.js';
import Player from './player.js';
import Enemy from './enemy.js';
import Phaser from 'phaser'
import EnemyManager from './enemyManager.js';
import Laser from './laser.js';
import Shooter from './shooter.js';

/**
 * Escena principal del juego. La escena se compone de una serie de plataformas 
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas. 
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella. 
 * @abstract Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
 * El juego termina cuando el jugador ha recogido 10 estrellas.
 * @extends Phaser.Scene
 */
export default class Level extends Phaser.Scene {
    /**
     * Constructor de la escena
     */
    constructor() {
        super({ key: 'level' });

    }

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {
        this.stars = 10;
        this.bases = this.add.group();
        this.player = new Player(this, 200, 300);
        this.player.setDepth(1);
        //Seria mejor hacer un grupo y repartirlo por la pantalla, solo bordes
        this.enemyManager = new EnemyManager(this, 4, this.player)
        this.enemyManager.fillPool()
        this.initMap()

        this.lasergroup = this.add.group();
        this.initLasers();

        this.physics.add.overlap(this.lasergroup, this.player, (obj1, obj2) => {
            //Solo le afecta al player si esta completamente visible el rayo
            if (obj1.completeVisible && !this.player.isDashing) {
                this.player.hitPlayer(obj1.damage)
            } else if (obj1.completeVisible && this.player.isDashing) {
                this.player.dashLaser(obj1.scoreDodge)
            }

        });


        //Se define la intro y se reproduce. Cuando termina, se pone en bucle el body de la canción. 
        const intro = this.sound.add('intro_music', { volume: 0.3 });

        intro.play();

        let audio_aux = this.sound;

        intro.once('complete', function () {
            audio_aux.add('body_music', {
                volume: 0.3,
                loop: true
            }).play();
        });

        this.lastMark = this.player.scoreManager.currentMark
        this.movingLasers = false
        this.updateTimers(this.lastMark);

        this.mute_button = this.add.image(this.game.renderer.width - 150, this.game.renderer.height - 70, "mute_button").setScale(0.15).setVisible(false);
        this.sound_button = this.add.image(this.game.renderer.width - 150, this.game.renderer.height - 70, "sound_button").setScale(0.15);

        this.mute_button.setInteractive();
        this.mute_button.on("pointerup", () => {
            if (this.sound.mute == true) {
                this.sound.mute = false
                this.mute_button.setVisible(false);
                this.sound_button.setVisible(true);
            }
            else {
                this.sound.mute = true
                this.mute_button.setVisible(true);
                this.sound_button.setVisible(false);
            }

        });

        this.sound_button.setInteractive();
        this.sound_button.on("pointerup", () => {
            if (this.sound.mute == true) {
                this.sound.mute = false
                this.mute_button.setVisible(false);
                this.sound_button.setVisible(true);
            }
            else {
                this.sound.mute = true
                this.mute_button.setVisible(true);
                this.sound_button.setVisible(false);
            }

        });
    }

    update() {
        this.enemyManager.spawnRandomEnemy()

        if (this.player.scoreManager.currentMark !== this.lastMark) {
            this.lastMark = this.player.scoreManager.currentMark
            this.updateTimers(this.lastMark)
            console.log("SCORE", this.player.scoreManager.currentMark, this.lastMark)
        }
    }
    /**
     * Genera una estrella en una de las bases del escenario
     * @param {Array<Base>} from Lista de bases sobre las que se puede crear una estrella
     * Si es null, entonces se crea aleatoriamente sobre cualquiera de las bases existentes
     */
    spawn(from = null) {
        Phaser.Math.RND.pick(from || this.bases.children.entries).spawn();
    }

    /**
     * Método que se ejecuta al coger una estrella. Se pasa la base
     * sobre la que estaba la estrella cogida para evitar repeticiones
     * @param {Base} base La base sobre la que estaba la estrella que se ha cogido
     */
    starPickt(base) {
        this.player.point();
        if (this.player.score == this.stars) {
            this.scene.start('end');
        }
        else {
            let s = this.bases.children.entries;
            this.spawn(s.filter(o => o !== base));

        }
    }

    initMap() {
        const mapa = this.map = this.make.tilemap({
            key: 'mapa'
        });

        // TILE IMAGE
        const tiles = mapa.addTilesetImage('tileset x1', 'tilesmapa');
        const tiles2 = mapa.addTilesetImage('pixel-cyberpunk-interior', 'tilesmapa2');

        this.groundLayer = this.map.createLayer('capa1', tiles);
        this.groundCollider = this.map.createLayer('capasuelo', [tiles, tiles2]);
        this.walllayer = this.map.createLayer('capa2', tiles);
        this.walllayer2 = this.map.createLayer('capa3', tiles);
        this.boxes = this.map.createLayer('capa4', tiles2);
        this.tables = this.map.createLayer('capa5', tiles2);
        this.objects = this.map.createLayer('capa6', tiles2);
        this.objects2 = this.map.createLayer('capa7', tiles2);
        this.objects3 = this.map.createLayer('capa8', tiles2);

        this.walllayer.setCollisionBetween(1, 5000);
        this.walllayer2.setCollisionBetween(1, 5000);
        this.groundCollider.setCollisionBetween(1, 5000);
        this.objects.setCollisionBetween(1, 5000);

        this.physics.add.collider(this.player, this.walllayer);
        this.physics.add.collider(this.player, this.walllayer2);
        this.physics.add.collider(this.player, this.groundCollider);
        this.physics.add.collider(this.player, this.objects);
    }

    initLasers() {
        // Crear shooters
        this.shooter_left = new Shooter(this, 1135, 435, 'left');
        this.shooter_left.setRotation(Phaser.Math.DegToRad(90));
        this.shooter_right = new Shooter(this, 15, 212, 'right');
        this.shooter_right.setRotation(Phaser.Math.DegToRad(-90));
        this.shooter_down = new Shooter(this, 433, 18, 'down');
        this.shooter_top = new Shooter(this, 851, 596, 'top');
        this.shooter_top.setRotation(Phaser.Math.DegToRad(180));

        //horizontal laser
        this.laser = new Laser(this, 580, 435, false, this.lasergroup, this.shooter_left);
        this.laser3 = new Laser(this, 580, 212, false, this.lasergroup, this.shooter_right);

        //vertical
        this.laser4 = new Laser(this, 433, 305, true, this.lasergroup, this.shooter_down);
        this.laser5 = new Laser(this, 851, 310, true, this.lasergroup, this.shooter_top);

        this.lasergroup.addMultiple([this.laser, this.laser3, this.laser4, this.laser5]);

        this.lasergroup.children.iterate(c => {
            this.lasergroup.killAndHide(c);
            c.body.checkCollision.none = true;
        });
    }


    spawnLaser() {
        this.lasergroup.shuffle()
        let laser = this.lasergroup.getFirstDead()
        if (laser) {
            laser.initLaser(this.movingLasers);
        }
    }

    updateTimers(mark) {
        let delay = 5000;

        if (mark < 40) {
            delay -= 1000
        } else if (mark < 50) {
            delay -= 1500
        } else if (mark < 70) {
            delay -= 2000
        } else if (mark < 90) {
            delay -= 2500
            this.movingLasers = true
        } else if (mark < 100) {
            delay -= 3000
            this.movingLasers = true
        } else {
            delay -= 3500
            this.movingLasers = true
        }

        this.spawnLaserTimer = this.time.addEvent({
            delay: delay,
            callback: this.spawnLaser,
            callbackScope: this,
            loop: true
        });
    }
}
