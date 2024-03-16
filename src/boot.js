import Phaser from 'phaser'


import platform from '../assets/sprites/platform.png'
import base from '../assets/sprites/base.png'
import star from '../assets/sprites/star.png'
import tileset from '../assets/tilesets/tileset_x1.png'
import map from  '../assets/maps/mapa.json'
import player from '../assets/sprites/player1.png'
import laser from '../assets/sprites/laser.png'
import player_dash from '../assets/sprites/player_dash.png'
import teacher from '../assets/sprites/teacher_spritesheet.png'
const mondongo = require("url:../assets/sounds/mondongo.mp3");
const intro_music = require("url:../assets/sounds/intro.wav");
const body_music = require("url:../assets/sounds/body.wav");
import tileset2 from '../assets/tilesets/pixel-cyberpunk-interior.png'
import longray from '../assets/sprites/longray.png'
import pause_button from '../assets/sprites/PauseButton.png'

/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una 
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class Boot extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'boot' });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    this.load.tilemapTiledJSON('mapa', map);

    this.load.image('tilesmapa', tileset);
    this.load.image('tilesmapa2', tileset2);
    
    this.load.audio('mondongo', mondongo)
    this.load.audio('intro_music', intro_music);
    this.load.audio('body_music', body_music);
    this.load.setPath('assets/sprites/');
    this.load.image('platform', platform);
    this.load.image('base', base);
    this.load.image('star', star);
    this.load.image('laser', laser);
    this.load.image('longray', longray);
    this.load.spritesheet('player', player, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('teacher', teacher, { frameWidth: 42, frameHeight: 64 });
    this.load.spritesheet('player_dash', player_dash, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('pause_button', pause_button, { frameWidth: 64, frameHeight: 64 });
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.scene.start('level');
  }
}