export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader') //this scene is called preloader
    }

    preload() {
        console.log("before image loaded");
        this.load.image('image1','./game/int.png')
        this.load.image('image2','./game/room.png')
        this.load.tilemapTiledJSON('map','./game/mapout2.tmj')
        console.log("image loaded");
    }

    create() {
        this.scene.start('creater')
    }
}