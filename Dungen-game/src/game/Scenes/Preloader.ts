import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    console.log("Before loading image...");
    this.load.image('tiles', '/assets/tiles.png');
    this.load.tilemapTiledJSON('map','/assets/map.tmj')
  }

  create() {
    console.log("Image loaded, starting game scene...");
    // this.add.image(200, 125, 'tiles'); // Centered image
    this.scene.start('game'); // Start the game scene
  }
}
