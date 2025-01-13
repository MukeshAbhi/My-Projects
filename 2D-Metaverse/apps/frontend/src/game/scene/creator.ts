class Creater extends Phaser.Scene {
    constructor() {
        super ('creater')
    }

    create() {
        const map = this.make.tilemap({key: 'map'});
        const tileSet1 = map.addTilesetImage('walls','image2');
        const tileSet2 = map.addTilesetImage('interior', 'image1');

        const floor = map.createLayer('floor',tileSet1!);
        const objects = map.createLayer('objects', tileSet2!);
        const border = map.createLayer('border',tileSet1!)
    }
}

export default Creater;