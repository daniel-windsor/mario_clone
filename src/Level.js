import Phaser from 'phaser'
import ground from './assets/block.png'
import player from './assets/mario.png'

const gameState = {
  score: 0
}

class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    this.load.image('ground', ground)
    this.load.spritesheet('player', player, { frameWidth: 32, frameHeight: 34 })
  }

  create() {
    gameState.ground = this.physics.add.staticGroup()
    gameState.player = this.physics.add.sprite(400, 400, 'player')

    this.physics.add.collider(gameState.player, gameState.ground)

    this.createAnimations()

    this.levelSetup()

    this.cameras.main.setBounds(0, 0, 3312, 600)
    this.physics.world.setBounds(0, 0, 3312, 600)
    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)

    gameState.player.setCollideWorldBounds(true)

    gameState.cursors = this.input.keyboard.createCursorKeys();
  }

  createGround (xIndex, yIndex) {
    if (typeof xIndex === 'number' && typeof yIndex === 'number') {
      gameState.ground.create((xIndex * 16), yIndex * 568, 'ground')
        .setOrigin(0, 0)
        .refreshBody()
      gameState.ground.create((xIndex * 16), yIndex * 584, 'ground')
      .setOrigin(0, 0)
      .refreshBody()
    }
  }

  levelSetup () {
    for (const [xIndex, yIndex] of this.ground.entries()) {
      this.createGround(xIndex, yIndex)
    }
  }

  createAnimations () {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', {start: 5, end: 5 }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {start: 2, end: 4}),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 })
    })
  }

  update() {
    if (gameState.cursors.right.isDown) {
      gameState.player.flipX = true
      gameState.player.anims.play('walk', true)
      gameState.player.setVelocityX(150)
    } else if (gameState.cursors.left.isDown) {
      gameState.player.flipX = false
      gameState.player.anims.play('walk', true)
      gameState.player.setVelocityX(-150)
    } else {
      gameState.player.anims.play('idle', true)
      gameState.player.setVelocityX(0)
    }

    if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.touching.down) {
      gameState.player.anims.play('jump', true)
      gameState.player.setVelocityY(-150)
    }

    if (!gameState.player.body.touching.down) {
      gameState.player.anims.play('jump', true)
    }

  }
}

export default Level