import Phaser from 'phaser'
import ground from './assets/ground.png'
import player from './assets/mario.png'
import bushes from './assets/bushes.png'
import clouds from './assets/clouds.png'
import brick from './assets/brick.png'
import brick2 from './assets/brick2.png'
import special from './assets/special.png'
import pipe from './assets/pipe.png'
import castle from './assets/castle.png'
import flag from './assets/flag.png'
import goomba from './assets/goomba.png'

const gameState = {
  score: 0
}

class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    this.load.image('bushes', bushes)
    this.load.image('clouds', clouds)
    this.load.image('ground', ground)
    this.load.image('brick', brick)
    this.load.image('brick2', brick2)
    this.load.image('pipe', pipe)
    this.load.image('flag', flag)
    this.load.image('castle', castle)

    this.load.spritesheet('player', player, { frameWidth: 32, frameHeight: 34 })
    this.load.spritesheet('special', special, { frameWidth: 16, frameHeight: 16 })

    this.load.spritesheet('goomba', goomba, { frameWidth: 26, frameHeight: 18 })

  }

  create() {
    for (let x = 0; x < 5; x++) {
      this.add.image(x * 766, 160, 'bushes').setOrigin(0, 0)
    }

    for (let x = 0; x < 8; x++) {
      this.add.image(x * 768,  16, 'clouds').setOrigin(0, 0)
    }

    this.add.image(3172, 124, 'flag')
    this.add.image(3232, 128, 'castle').setOrigin(0, 0)

    gameState.scenery = this.physics.add.staticGroup()

    gameState.ground = this.physics.add.staticGroup()
    gameState.player = this.physics.add.sprite(100, 180, 'player')
    gameState.special = this.physics.add.staticGroup()
    gameState.brick = this.physics.add.staticGroup()
    gameState.pipe = this.physics.add.staticGroup()
    gameState.pyramid = this.physics.add.staticGroup()

    gameState.goombas = this.physics.add.group({
      velocityX: -50,
      bounceX: 1,
      collideWorldBounds: true
    })


    this.physics.add.collider(gameState.player, gameState.scenery)
    this.physics.add.collider(gameState.goombas, gameState.scenery)

    this.physics.add.collider(gameState.player, gameState.goombas, (_player, _goomba) => {
      if (_player.body.touching.left || _player.body.touching.right) {
        this.scene.restart()
      }

      if (_player.body.touching.down || _goomba.body.touching.up) {
        _player.setVelocityY(-150)
        _goomba.destroy()
      }
    }) 
    
    this.physics.add.collider(gameState.player, gameState.brick, function(_player, _brick) {
      if (gameState.player.body.touching.up) {
        _brick.destroy()
        gameState.player.setVelocityY(0)
      }
    })

    this.physics.add.collider(gameState.player, gameState.special, function(_player, _special) {
      if (gameState.player.body.touching.up) {
        _special.destroy()
        gameState.player.setVelocityY(0)
      }
    })

    this.createAnimations()

    this.levelSetup()

    this.cameras.main.setBounds(0, 0, 3328, 240)
    this.physics.world.setBounds(0, 0, 3328, 280)

    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)

    gameState.player.setCollideWorldBounds(true)

    gameState.goombas.playAnimation('goombaWalk', true)


    gameState.cursors = this.input.keyboard.createCursorKeys();
  }

  createGround (xIndex, yIndex) {
    if (typeof xIndex === 'number' && typeof yIndex === 'number') {
      gameState.scenery.create((xIndex * 16), yIndex * 208, 'ground')
        .setOrigin(0, 0)
        .refreshBody()
      gameState.scenery.create((xIndex * 16), yIndex * 224, 'ground')
      .setOrigin(0, 0)
      .refreshBody()
    }
  }

  createBrick (xIndex, yIndex) {
    gameState.brick.create(xIndex, yIndex, 'brick')
      .setOrigin(0, 0)
      .refreshBody()
  }

  createSpecial (xIndex, yIndex) {
    gameState.special.create(xIndex, yIndex, 'special')
    .setOrigin(0, 0)
    .refreshBody()
  }

  createPipe (xIndex, yIndex) {
    gameState.scenery.create(xIndex, yIndex, 'pipe')
    .setOrigin(0, 0)
    .refreshBody()
  }

  createPyramid (xIndex, yIndex) {
    gameState.scenery.create(xIndex, yIndex, 'brick2')
    .setOrigin(0, 0)
    .refreshBody()
  }

  createGoomba (xIndex, yIndex) {
    gameState.goombas.create(xIndex, yIndex, 'goomba')
      .setOrigin(0, 0)
  }

  levelSetup () {
    for (const [i, pos] of this.pipe.entries()) {
      this.createPipe(pos.x, pos.y)
    }

    for (const [xIndex, yIndex] of this.ground.entries()) {
      this.createGround(xIndex, yIndex)
    }

    for (const [i, pos] of this.brick.entries()) {
      this.createBrick(pos.x, pos.y)
    }

    for (const [i, pos] of this.special.entries()) {
      this.createSpecial(pos.x, pos.y)
    }

    for (const [i, pos] of this.pyramid.entries()) {
      if (pos.single) {
        for (let i = 0; i < pos.col; i ++) {
          this.createPyramid(pos.x, pos.y + i * 16)
        }
      }

      if (!pos.reverse) {
        for (let i = 0; i < pos.row; i ++) {
          for (let j = 0; j <= i; j++) {
            this.createPyramid((pos.x + i * 16),  pos.y - (j * 16))
          }
        }
      } 
      
      if (pos.reverse) {
        for (let i = 0; i < pos.row; i ++) {
          for (let j = 0; j <= i; j++) {
            this.createPyramid(pos.x + (j * 16), (pos.y + i * 16),  )
          }
        }
      }
    }

    for (const [i, pos] of this.goomba.entries()) {
      this.createGoomba(pos.x, pos.y)
    }

  }

  createAnimations () {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', {start: 5, end: 5 }),
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

    this.anims.create({
      key: 'flash',
      frames: this.anims.generateFrameNumbers('special', {start: 0, end: 1}),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'goombaWalk',
      frames: this.anims.generateFrameNumbers('goomba', {start: 0, end: 1}),
      frameRate: 6,
      repeat: -1
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
      gameState.player.setVelocityY(-275)
    }

    if (!gameState.player.body.touching.down) {
      gameState.player.anims.play('jump', true)
    }

    if (gameState.player.y > 260) {
      this.scene.restart()
    }
  }
}

export default Level