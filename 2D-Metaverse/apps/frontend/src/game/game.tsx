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
                debug: true
            }
        },
        scale: {
            zoom: 2
        },
    }

    return (
        <NewGame config={config} />
    )
}

export default Game
