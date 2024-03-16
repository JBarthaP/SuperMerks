import Phaser from 'phaser'



export default class Bullet extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, direction, speed, player) {
      super(scene, x, y, 'laser');
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.scene.physics.add.collider(this, player); 
      this.setRotation(direction.angle())
      this.setScale(2)

      //Bullets vars
      this.direction = direction;
      this.speed = speed;
  }

  preUpdate(t,dt) {
    super.preUpdate(t,dt)
      // Actualizar la posición de la bala en cada fotograma
      this.x += this.direction.x * this.speed;
      this.y += this.direction.y * this.speed;
  }

  hitCollisionPlayer()
  {

  }
}
