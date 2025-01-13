import NewGame from "./main"
import Creater from "./scene/creator"
import Preloader from "./scene/preloader"

const Game = () => {
    const config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 1000,
        scene: [Preloader, Creater],
    }

    return (
        <NewGame config={config} />
    )
}

export default Game
