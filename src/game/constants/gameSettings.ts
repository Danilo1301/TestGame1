import { getIsMobile } from "../../utils/utils";

export const gameSettings = {
    playHitSound: getIsMobile() ? false : false,
    comboAward: 20,
    showFPS: true,
    noteTimeToAchieve: 1000,
    currency: "GC$",
    exposeVars: true
}