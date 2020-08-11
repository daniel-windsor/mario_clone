import Phaser from 'phaser'
import Level1 from './Level1'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  backgroundColor: "123456",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 300},
      debug: false
    }
  },
  scene: [Level1]
}


const game = new Phaser.Game(config);