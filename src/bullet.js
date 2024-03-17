import Phaser from 'phaser'
import Player from './player';



export default class Bullet extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, direction, speed, player) {
      super(scene, x, y, 'laser');
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.scene.physics.add.collider(this, player); 
      this.setRotation(direction.angle())
      this.setScale(2)

      this.body.setSize(10)
      //Bullets vars
      this.direction = direction;
      this.speed = speed;
      this.damage = 1
  }

  preUpdate(t,dt) {
    super.preUpdate(t,dt)
      // Actualizar la posición de la bala en cada fotograma
      this.x += this.direction.x * this.speed;
      this.y += this.direction.y * this.speed;
      if (this.scene.physics.overlap(this.scene.player, this)) {
        if(this.scene.player.isAttacking){
          this.destroy()
        }else if(!this.scene.player.isInmune && !this.scene.player.isDashing){
          this.scene.player.hitPlayer(this.damage)
          this.destroy()
        }
        
      }      
  }

  hitCollisionPlayer()
  {

  }
}
