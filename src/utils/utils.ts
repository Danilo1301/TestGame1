import { ExtendedObject3D } from "@enable3d/phaser-extension";

export function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function setObjectPosition(object: ExtendedObject3D, position: THREE.Vector3)
{
    const body = object.body.ammo;
    const transform = new Ammo.btTransform();
    body.getMotionState().getWorldTransform(transform);
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    body.setWorldTransform(transform);
    body.getMotionState().setWorldTransform(transform);
    Ammo.destroy(transform);
}

export const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

export const isNode = () =>
    typeof process !== 'undefined' &&
    !!process.versions &&
    !!process.versions.node;

export function msToTime(duration: number)
{
    //var milliseconds = Math.floor((duration % 1000) / 100);

    var seconds = Math.floor((duration / 1000) % 60);
    var minutes = Math.floor((duration / (1000 * 60)) % 60);
    var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    var hoursStr = (hours < 10) ? "0" + `${hours}` : `${hours}`;
    var minutesStr = (minutes < 10) ? "0" + minutes : minutes;
    var secondsStr = (seconds < 10) ? "0" + seconds : seconds;
  
    //return hoursStr + ":" + minutesStr + ":" + secondsStr + "." + milliseconds;
    return hoursStr + ":" + minutesStr + ":" + secondsStr;
}

export function msToMinutes(duration: number)
{
    var seconds = Math.floor((duration / 1000) % 60);
    var minutes = Math.floor((duration / (1000 * 60)) % 60);
  
    var minutesStr = (minutes < 10) ? "0" + minutes : minutes;
    var secondsStr = (seconds < 10) ? "0" + seconds : seconds;
  
    //return hoursStr + ":" + minutesStr + ":" + secondsStr + "." + milliseconds;
    return minutesStr + ":" + secondsStr;
}
  

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
export function clamp(number: number, min: number, max: number) {
    return Math.min(Math.max(number, min), max);
};

export function getQueryParamsFromString(str: string)
{
    const urlParams = new URLSearchParams(str);
    const queryParams: { [key: string]: string } = {};

    for (const [key, value] of urlParams.entries()) {
        queryParams[key] = value;
    }

    return queryParams;
}

export function getQueryParams()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams: { [key: string]: string } = {};

    for (const [key, value] of urlParams.entries()) {
        queryParams[key] = value;
    }

    return queryParams;
}

export const getIsMobile = () => {
    try {
        if(location.href.includes("#mobile")) return true;
        return isMobile.any() != null;
    } catch (error) {}
    return false;
};