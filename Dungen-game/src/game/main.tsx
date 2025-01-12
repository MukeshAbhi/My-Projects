import Phaser from "phaser";
import GameScene from "./Scenes/scene";
import Preloader from "./Scenes/Preloader";
import Game from "./game";

const NewGame = () => {
  const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    scene: [Preloader, GameScene], // Register both scenes
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
      },
    },
   
  };

  return (
    <div>
      <Game config={config} />
    </div>
  );
};

export default NewGame;
