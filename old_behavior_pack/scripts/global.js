import { GameDatabase, ScoreboardMap, SessionGameElement, SafeAreas, RadiusArea } from 'wrapper';
import config from 'config.js';
import { InfoMapProperties } from 'resources';

const global = {
    initialized: false,
    /**@type {SessionGameElement} */
    session: null,
    /**@type {GameDatabase} */
    database: null,
    config,
    /**@type {ScoreboardMap} */
    infoMap: null,
    safeArea: new SafeAreas(),
    get coins() { return this.infoMap.get(InfoMapProperties.coins) },
    set coins(v) { this.infoMap.set(InfoMapProperties.coins, v) },
    get stone() { return this.infoMap.get(InfoMapProperties.stones) },
    set stone(v) { this.infoMap.set(InfoMapProperties.stones, v) },
    get wood() { return this.infoMap.get(InfoMapProperties.woods) },
    set wood(v) { this.infoMap.set(InfoMapProperties.woods, v) },
    get round() { return this.getDynamicProperty("round") ?? 0 }, 
    set round(n) { this.setDynamicProperty("round", n) },
    get hp() { return this.getDynamicProperty("hp") ?? 0 }, 
    set hp(n) { this.setDynamicProperty("hp", n) }
};
globalThis.global = global;
export { global };
export default global;
//use import {global} from 'global.js';
//or import global from 'global.js'

global.safeArea.add(new RadiusArea({ x: 75, y: 62, z: 115 }, 27))
