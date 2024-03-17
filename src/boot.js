import Phaser from 'phaser'


import platform from '../assets/sprites/platform.png'
import base from '../assets/sprites/base.png'
import star from '../assets/sprites/star.png'
import tileset from '../assets/tilesets/tileset_x1.png'
import map from  '../assets/maps/mapa.json'
import player from '../assets/sprites/player1.png'
import laser from '../assets/sprites/laser.png'
import player_dash from '../assets/sprites/player_dash.png'
import playerextra from '../assets/sprites/playerextra.png'
import teacher from '../assets/sprites/teacher_spritesheet.png'
const mondongo = require("url:../assets/sounds/mondongo.mp3");
const intro_music = require("url:../assets/sounds/intro.wav");
const body_music = require("url:../assets/sounds/body.wav");
const wrong_answer_music = require("url:../assets/sounds/WrongAnswer.wav");
const bababooey = require("url:../assets/sounds/BabaBooey.mp3");

import tileset2 from '../assets/tilesets/pixel-cyberpunk-interior.png'
import longray from '../assets/sprites/longray.png'
import pause_button from '../assets/sprites/PauseButton.png'
import play_button from '../assets/sprites/PlayButton.png'
import mute_button from '../assets/sprites/mute.png'
import sound_button from '../assets/sprites/playSound.png'
import lasersprite from '../assets/sprites/lasers/lasersprite2.png'
import laserspritevert from '../assets/sprites/lasers/laserspriteVert.png'
import spritesheet_d from '../assets/sprites/spritesheet_libro.png'
import spritesheet_c from '../assets/sprites/spritesheet_unity.png'
import spritesheet_b from '../assets/sprites/spritesheet_teclado.png'
import spritesheet_a from '../assets/sprites/spritesheet_vscode.png'
import spritesheet_s from '../assets/sprites/spritesheet_domjudge.png'
import shooter from '../assets/sprites/disparador.png'
const dash_sound = require("url:../assets/sounds/dash.wav");
const damage_sound = require("url:../assets/sounds/damage.mp3");
import mainMenu from '../assets/sprites/background.png'
import table_back from '../assets/sprites/backTable.png'
import nota_f from '../assets/sprites/nota6.png'
import nota_d from '../assets/sprites/nota5.png'
import nota_c from '../assets/sprites/nota4.png'
import nota_b from '../assets/sprites/nota3.png'
import nota_a from '../assets/sprites/nota2.png'
import nota_s from '../assets/sprites/nota1.png'

const laser_sound = require("url:../assets/sounds/laser_beam.wav");
import full_screen from '../assets/sprites/full_screen.png'
import window_mode from '../assets/sprites/window_mode.png'
const shoot_sound = require("url:../assets/sounds/chalk_shoot.wav");
const collect_sound = require("url:../assets/sounds/collect.wav");
const finish_sound = require("url:../assets/sounds/start.wav");
const attack_sound = require("url:../assets/sounds/attack.wav");
const lose_sound = require("url:../assets/sounds/Evil_Laugh.wav");

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
    
    this.load.audio('finish_sound', finish_sound);
    this.load.audio('mondongo', mondongo)
    this.load.audio('shoot_sound', shoot_sound)
    this.load.audio('intro_music', intro_music);
    this.load.audio('body_music', body_music);
    this.load.setPath('assets/sprites/');
    this.load.image('platform', platform);
    this.load.image('base', base);
    this.load.image('star', star);
    this.load.image('laser', laser);
    this.load.image('longray', longray);
    this.load.spritesheet('player', player, { frameWidth: 64, frameHeight: 64 });
    this.load.audio('dash_sound', dash_sound);
    this.load.audio('damage_sound', damage_sound);
    this.load.audio('bababooey', bababooey);
    this.load.audio('attack_sound', attack_sound);
    this.load.audio('collect_sound', collect_sound);
    this.load.spritesheet('teacher', teacher, { frameWidth: 42, frameHeight: 64 });
    this.load.spritesheet('player_dash', player_dash, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerextra', playerextra, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('pause_button', pause_button, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('shooter', shooter, { frameWidth: 32, frameHeight: 32 });
    this.load.audio('lose_sound', lose_sound);

    //lasers
    this.load.audio('laser_beam', laser_sound);
    this.load.spritesheet('lasersprite', lasersprite, { frameWidth: 548, frameHeight: 16 });
    this.load.spritesheet('laserspritever', laserspritevert, { frameWidth: 16, frameHeight: 272 });

    //powerUps
    this.load.spritesheet('spritesheet_d', spritesheet_d, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('spritesheet_c', spritesheet_c, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('spritesheet_b', spritesheet_b, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('spritesheet_a', spritesheet_a, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('spritesheet_s', spritesheet_s, { frameWidth: 64, frameHeight: 64 });


    //mainMenu
    this.load.image('background_img', mainMenu);
    this.load.image('table_back', table_back);
    this.load.image('mute_button', mute_button);
    this.load.image('sound_button', sound_button);
    this.load.image('full_screen', full_screen);
    this.load.image('window_mode', window_mode);
    this.load.spritesheet('play_button', play_button, { frameWidth: 128, frameHeight: 128 });
    this.load.audio('wrong_answer_music', wrong_answer_music);


    //endMenu (win/lose)
    this.load.image('nota_s', nota_s);
    this.load.image('nota_a', nota_a);
    this.load.image('nota_b', nota_b);
    this.load.image('nota_c', nota_c);
    this.load.image('nota_d', nota_d);
    this.load.image('nota_f', nota_f);
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.scene.start('mainMenuScene');
  }
}