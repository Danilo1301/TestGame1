import Phaser from "phaser";
import { getIsMobile } from "../../utils/utils";


//export const gameSize: Phaser.Math.Vector2 = new Phaser.Math.Vector2(900, 600);
export const gameSizeDesktop: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1280, 720);
export const gameSizeMobile: Phaser.Math.Vector2 = new Phaser.Math.Vector2(720, 1280);

export const getGameSize = () => {
    return getIsMobile() ? gameSizeMobile : gameSizeDesktop;
};

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    transparent: true,
    width: getGameSize().x,
    height: getGameSize().y,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: getGameSize().x,
        height: getGameSize().y
    },
    scene: [],
    audio: {
        disableWebAudio: false
    },
    input: {
        activePointers: 3
    }
}

/*
export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: gameSize.x,
    height: gameSize.y,
    transparent: false,
    backgroundColor: 0x000,
    roundPixels: false,
    scene: [Test2Scene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gameSize.x,
        height: gameSize.y
    },
}
*/

