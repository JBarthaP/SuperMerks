import Enemy from "./enemy";
import { PUNTUACION } from "./scoreManager";

// POOL DE LOS ENEMIGOS

export default class EnemyManager {

    constructor(scene, max, player) {
        this.scene = scene
        this._group = scene.add.group();
        this.max = max;
        this.player = player
        this.bulletSpeed = 0.4
        this.assingEnemies()
        this.assingBulletSpeed()
        this.enemiesInUse = [];
    }

    // AÑADIR LOS ENEMIGOS
    addMultipleEntity(entities) {
        this._group.addMultiple(entities);
        this._group.children.iterate(c => {
            this._group.killAndHide(c);
            c.body.checkCollision.none = true;
        });
    }

    // FUNCION PARA HACER LIMPIEZA
    release(enemy) {
        enemy.body.checkCollision.none = true
        this._group.killAndHide(enemy)
    }

    // FUNCION PARA RELLENAR LA POOL
    fillPool(num) {
        let enemies = []

        // for (let i = 0; i < num; i++) {
        // }
        enemies.push(new Enemy(this.scene, 50, 50, this.player).setDepth(1));
        enemies.push(new Enemy(this.scene, 1154 / 2, 50, this.player).setDepth(1));
        enemies.push(new Enemy(this.scene, 1100, 50, this.player).setDepth(1));
        enemies.push(new Enemy(this.scene, 50, 640 / 2, this.player).setDepth(1));
        enemies.push(new Enemy(this.scene, 50, 570, this.player).setDepth(1));
        enemies.push(new Enemy(this.scene, 1100, 640 / 2, this.player).setDepth(1));
        enemies.push(new Enemy(this.scene, 1150 / 2, 570, this.player).setDepth(1));
        enemies.push(new Enemy(this.scene, 1100, 570, this.player).setDepth(1));

        this.addMultipleEntity(enemies);
    }

    // FUNCION PARA SPAWNEAR UN ENEMIGO ALEATORIO
    spawnRandomEnemy() {
        if (this.enemiesInUse.length < this.max) {
            // Obtener una posición aleatoria dentro del array de enemigos predefinidos
            const randomIndex = Phaser.Math.Between(0, this._group.children.size - 1);
            const enemy = this._group.children.entries[randomIndex];

            // Activar al enemigo si no está en uso
            if (!this.enemiesInUse.includes(enemy)) {
                enemy.setActive(true);
                enemy.setVisible(true);
                this.enemiesInUse.push(enemy);
            }
        }
    }

    // FUNCION PARA DESACTIVAR UN ENEMIGO
    despawnEnemy(enemy) {
        if (this.enemiesInUse.includes(enemy)) {
            enemy.setActive(false);
            enemy.setVisible(false);
            this.enemiesInUse = this.enemiesInUse.filter(activeEnemy => activeEnemy !== enemy);
        }
    }

    setMaxEnemies(currentMark) {
        this.max = this.enemiesMarks[currentMark]
    }

    setBulletSpeed(currentMark) {
        this.bulletSpeed = this.bulletsSpeed[currentMark]
        this._group.children.iterate(c => {
            c.setBulletSpeed(this.bulletSpeed)
        });
    }

    assingEnemies() {
        this.enemiesMarks = {
            [PUNTUACION.F]: 2,
            [PUNTUACION.D]: 3,
            [PUNTUACION.C]: 4,
            [PUNTUACION.B]: 5,
            [PUNTUACION.A]: 6,
            [PUNTUACION.S]: 8
        }
    }

    assingBulletSpeed() {
        this.bulletsSpeed = {
            [PUNTUACION.F]: 0.4,
            [PUNTUACION.D]: 0.6,
            [PUNTUACION.C]: 1,
            [PUNTUACION.B]: 1.2,
            [PUNTUACION.A]: 1.5,
            [PUNTUACION.S]: 2
        }
    }

}