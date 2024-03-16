import Phaser from 'phaser'



export default class Bullet extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, direction, speed) {
      super(scene, x, y, 'bala');
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this, true);
      this.scene.physics.add.collider(this, player); 

      //Bullets vars
      this.direction = direction;
      this.speed = speed;
  }

  update() {
      // Actualizar la posición de la bala en cada fotograma
      this.x += this.direction.x * this.speed;
      this.y += this.direction.y * this.speed;
  }
}
