import Phaser from 'phaser'
import Level1 from './Level1'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 600,
  height: 240,
  backgroundColor: "9290ff",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 600},
      debug: false
    }
  },
  scene: [Level1]
}


const game = new Phaser.Game(config);