import Phaser from 'phaser'

/**
 * Escena de fin de juego. Cuando se han recogido todas las estrellas, se presenta un
 * texto que indica que el juego se ha acabado.
 * Si se pulsa cualquier tecla, se vuelve a iniciar el juego.
 */
export default class Lose extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'lose' });
  }

  /**
   * Creación de la escena. Tan solo contiene el texto que indica que el juego se ha acabado
   */
  create() {
    this.add.text(85, 100, 'Nos vemos en septiembre crack').setOrigin(0).setAlign('center').setFontSize(55).setColor('#f55363');
    this.add.text(95, 200, 'No has conseguido aprobar la práctica ').setOrigin(0).setAlign('center').setFontSize(30);
    this.add.text(95, 230, 'del laboratorio.').setOrigin(0).setAlign('center').setFontSize(30);
    this.nota_f = this.add.image(this.game.renderer.width - 200, this.game.renderer.height - 200, "nota_f").setScale(4);


    this.back_to_menu = this.add.text(95, 450, '<Pagar segunda matrícula>').setOrigin(0).setAlign('center').setFontSize(30).setColor('#42ebcc');
    this.back_to_menu.setInteractive();
    this.back_to_menu.on("pointerup", () => {
      this.sound.stopAll();
      this.scene.start("mainMenuScene");
    });

    this.back_to_menu.on('pointerover', function (pointer) {
      this.setColor('#f55363');
    });

    this.back_to_menu.on('pointerout', function (pointer) {
      this.setColor('#42ebcc');
    });

  }

}