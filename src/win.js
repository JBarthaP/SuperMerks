import Phaser from 'phaser'

/**
 * Escena de fin de juego. Cuando se han recogido todas las estrellas, se presenta un
 * texto que indica que el juego se ha acabado.
 * Si se pulsa cualquier tecla, se vuelve a iniciar el juego.
 */
export default class Win extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'win' });
  }

  /**
   * Creación de la escena. Tan solo contiene el texto que indica que el juego se ha acabado
   */
  create() {
    this.add.text(85, 100, 'Lo conseguiste!').setOrigin(0).setAlign('center').setFontSize(55).setColor('#a453f5');;
    this.add.text(95, 200, 'Enhorabuena, estas navidades no tendrás que pedir').setOrigin(0).setAlign('center').setFontSize(30);
    this.add.text(95, 230, 'otra matrícula nueva.').setOrigin(0).setAlign('center').setFontSize(30);
    this.back_to_menu = this.add.text(95, 450, '<Volver a la cafetería>').setOrigin(0).setAlign('center').setFontSize(30).setColor('#42ebcc');
    this.back_to_menu.setInteractive();
    this.back_to_menu.on("pointerup", () => {
      this.sound.stopAll();
      this.scene.start("mainMenuScene");
    });

    this.back_to_menu.on('pointerover', function (pointer) {
      this.setColor('#a453f5');
    });

    this.back_to_menu.on('pointerout', function (pointer) {
      this.setColor('#42ebcc');
    });

    this.nota_f = this.add.image(this.game.renderer.width - 200, this.game.renderer.height - 200, "nota_s").setScale(4);

  }

}