import Platform from './platform.js';
import Player from './player.js';
import Enemy from './enemy.js';
import Phaser from 'phaser'
import EnemyManager from './enemyManager.js';


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
        this.enemyManager = new EnemyManager(this,4, this.player)
        this.enemyManager.fillPool()
        this.initMap()

        //Se define la intro y se reproduce. Cuando termina, se pone en bucle el body de la canción. 
        const intro = this.sound.add('intro_music', {volume: 0.3});

        intro.play();

        let audio_aux = this.sound;

        intro.once('complete', function () {
            audio_aux.add('body_music', {
                volume: 0.3,
                loop: true
            }).play();
        });
    }

    update() {
        this.enemyManager.spawnRandomEnemy()
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
        this.walllayer = this.map.createLayer('capa2', tiles);
        this.walllayer2 = this.map.createLayer('capa3', tiles);
        this.boxes = this.map.createLayer('capa4', tiles2);
        this.tables = this.map.createLayer('capa5', tiles2);
        this.objects = this.map.createLayer('capa6', tiles2);
        this.objects2 = this.map.createLayer('capa7', tiles2);
        this.objects3 = this.map.createLayer('capa8', tiles2);
        this.shooter = this.map.createLayer('capa9', tiles2);

        this.walllayer.setCollisionBetween(1, 1000);
        this.walllayer2.setCollisionBetween(1, 1000);
        this.boxes.setCollisionBetween(1, 1000);
        this.tables.setCollisionBetween(1, 1000);
        this.objects.setCollisionBetween(1, 1000);
        this.objects2.setCollisionBetween(1, 1000);

        this.physics.add.collider(this.player, this.walllayer);
        this.physics.add.collider(this.player, this.walllayer2);
        this.physics.add.collider(this.player, this.boxes);
        this.physics.add.collider(this.player, this.tables);
        this.physics.add.collider(this.player, this.objects3);
        this.physics.add.collider(this.player, this.objects4);
        this.physics.add.collider(this.player, this.objects5);
        this.physics.add.collider(this.player, this.objects6);
    }
}
