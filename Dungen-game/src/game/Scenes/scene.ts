import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    console.log("Game scene started!");
    const map2 = this.make.tilemap({key: 'map'});

   const tileset = map2.addTilesetImage('dungen','tiles')
   map2.createLayer('ground', tileset!)
  const wallsLayer =  map2.createLayer('walls', tileset!)
  wallsLayer?.setCollisionByProperty({collides: true})
    
  const debugGraphics = this.add.graphics().setAlpha(0.7)
    wallsLayer?.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243,234,43,255),
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })
  }
}
