import { useEffect, useRef } from "react"
import Phaser from "phaser";

const Game = ({config} : {config : Phaser.Types.Core.GameConfig}) => {
    const gameRef = useRef<HTMLDivElement | null>(null) 

    useEffect(() => {
        if (gameRef.current) {
            const game = new Phaser.Game({...config, parent: gameRef.current});

            return () => {
                game.destroy(true);
            }
        }
    }, [config])

    return (
        <div ref={gameRef}  style={{width: '100%', height: '100%'}}/>
    )
}

export default Game;