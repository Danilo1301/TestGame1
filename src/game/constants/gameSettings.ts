import { getIsMobile } from "../../utils/utils";

export const gameSettings = {
    playHitSound: getIsMobile() ? false : false,
    comboAward: 20,
    showFPS: false,
    noteTimeToAchieve: 1000,
    currency: "GC$",
    redirectToUrl: "https://guitarrinha.com/play",
    exposeVars: true
}