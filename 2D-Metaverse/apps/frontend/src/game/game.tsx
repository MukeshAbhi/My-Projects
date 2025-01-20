import NewGame from "./main"
import GameScene from "./scene/preloader"



const Game = () => {
    const config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 700,
        scene: [GameScene],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scale: {
            zoom: 1.2,
            model: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
    }

    return (
        <NewGame config={config} />
    )
}

export default Game
