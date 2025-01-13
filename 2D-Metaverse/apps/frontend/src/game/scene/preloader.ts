export default class GameScene extends Phaser.Scene {
    
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private player0!: Phaser.Physics.Arcade.Sprite

    constructor() {
        super('gameScene') //this scene is called preloader
    }

    preload() {
        console.log("before image loaded");
        this.load.image('image1','./game/int.png')
        this.load.image('image2','./game/room.png')
        this.load.tilemapTiledJSON('map','./game/mapout2.tmj')
        this.load.spritesheet('player','./game/adamrun.png',{frameWidth: 16, frameHeight: 32})
        console.log("image loaded");

        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    create() {
        console.log("hihihiihih")
        const map = this.make.tilemap({key: 'map'});
        const tileSet1 = map.addTilesetImage('walls','image2');
        const tileSet2 = map.addTilesetImage('interior', 'image1');

        const floor = map.createLayer('floor',tileSet1!);
        const objects = map.createLayer('objects', tileSet2!);
        const border = map.createLayer('border',tileSet1!)

        border?.setCollisionByProperty({collide: true});
        objects?.setCollisionByProperty({collide: true});

        const debugGraphics = this.add.graphics().setAlpha(0.7);
        border?.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,234,43,255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        })

        objects?.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,234,43,255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        })

        this.player0 = this.physics.add.sprite(40,40,'player')
        this.player0.body?.setSize(this.player0.width * 0.5, this.player0.height * 0.6)

         this.anims.create({
            key:'run-right',
            frames: this.anims.generateFrameNumbers("player", {frames:[0,1,2,3,4,5]}),
            frameRate: 16,
            repeat:-1
         })

         this.anims.create({
            key:'run-left',
            frames: this.anims.generateFrameNumbers("player", {frames:[12,13,14,15,16,17]}),
            frameRate: 16,
            repeat:-1
         })

         this.anims.create({
            key:'run-up',
            frames: this.anims.generateFrameNumbers("player", {frames:[6,7,8,9,10,11]}),
            frameRate: 16,
            repeat:-1
         })

         this.anims.create({
            key:'run-down',
            frames: this.anims.generateFrameNumbers("player", {frames:[18,19,20,21,22,23]}),
            frameRate: 16,
            repeat:-1
         })

         this.anims.create({
            key:'idel-right',
            frames: this.anims.generateFrameNumbers("player", {frames:[2]}),
            frameRate: 16,
            repeat:-1
         })

         this.anims.create({
            key:'idel-left',
            frames: this.anims.generateFrameNumbers("player", {frames:[17]}),
            frameRate: 16,
            repeat:-1
         })

         this.anims.create({
            key:'idel-up',
            frames: this.anims.generateFrameNumbers("player", {frames:[6]}),
            frameRate: 16,
            repeat:-1
         })

         this.anims.create({
            key:'idel-down',
            frames: this.anims.generateFrameNumbers("player", {frames:[21]}),
            frameRate: 16,
            repeat:-1
         })

        this.physics.add.collider(this.player0, objects!);
        this.physics.add.collider(this.player0, border!)
    }

    update() {
        if (!this.cursors || !this.player0) {
            return;
        }
    
        let isMoving = false;
    
        // Horizontal Movement
        if (this.cursors.left.isDown) {
            this.player0.setVelocityX(-50);
            this.player0.setVelocityY(0);
            if (this.player0.anims.currentAnim?.key !== 'run-left') {
                this.player0.anims.play('run-left', true);
            }
            isMoving = true;
        } else if (this.cursors.right.isDown) {
            this.player0.setVelocityX(50);
            this.player0.setVelocityY(0);
            if (this.player0.anims.currentAnim?.key !== 'run-right') {
                this.player0.anims.play('run-right', true);
            }
            isMoving = true;
        } else {
            this.player0.setVelocityX(0);
        }
    
        // Vertical Movement
        if (this.cursors.up.isDown || (this.cursors.up.isDown && (this.cursors.right.isDown || this.cursors.left.isDown)))  {
            this.player0.setVelocityY(-50);
            this.player0.setVelocityX(0);
            if (this.player0.anims.currentAnim?.key !== 'run-up') {
                this.player0.anims.play('run-up', true);
            }
            isMoving = true;
        } else if (this.cursors.down.isDown || (this.cursors.down.isDown && (this.cursors.right.isDown || this.cursors.left.isDown))) {
            this.player0.setVelocityY(50);
            this.player0.setVelocityX(0);
            if (this.player0.anims.currentAnim?.key !== 'run-down') {
                this.player0.anims.play('run-down', true);
            }
            isMoving = true;
        } else {
            this.player0.setVelocityY(0);
        }
    
        // Idle Animation
        if (!isMoving) {
            const currentAnim = this.player0.anims.currentAnim?.key;
            if (currentAnim?.includes('left')) {
                this.player0.anims.play('idle-left', true);
            } else if (currentAnim?.includes('right')) {
                this.player0.anims.play('idle-right', true);
            } else if (currentAnim?.includes('up')) {
                this.player0.anims.play('idle-up', true);
            } else if (currentAnim?.includes('down')) {
                this.player0.anims.play('idle-down', true);
            }
        }

        if (this.cursors.down.isDown && this.cursors.left.isDown) {
            return ;
        }
    }
    
}