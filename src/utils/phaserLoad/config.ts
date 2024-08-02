import Phaser from "phaser";

export const gameSize: Phaser.Math.Vector2 = new Phaser.Math.Vector2(900, 600);

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: gameSize.x,
    height: gameSize.y,
    transparent: false,
    backgroundColor: 0x000,
    roundPixels: false,
    scene: {}
}