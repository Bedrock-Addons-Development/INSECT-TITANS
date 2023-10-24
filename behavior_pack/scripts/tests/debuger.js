import { Player, world } from "@minecraft/server";

export class Debuger{
    constructor(){
        this.entries = new Map();
        world.beforeEvents.chatSend.subscribe(async e=>{
            if(e.message.startsWith("!") && this.allowDebuger){
                e.cancel = true;
                await null;
                const [key, ...params] = e.message.substring(1).split(/[ ]+/g);
                if(!this.entries.has(key?.toLocaleLowerCase())) return e.sender.sendMessage("No action for: " + key);
                this.entries.get(key?.toLocaleLowerCase())(e.sender,...params);
            }
        });
    }
    /**@type {boolean} */
    get enabledLoaders(){return world.getDynamicProperty("__debug__runLoaders")??true;}
    set enabledLoaders(v){world.setDynamicProperty("__debug__runLoaders",!!v);}
    /**@type {boolean} */
    get allowDebuger(){return world.getDynamicProperty("__debug__allowDebuger")??false;}
    set allowDebuger(v){world.setDynamicProperty("__debug__allowDebuger",!!v);}
    /**@param {string} key @param {(sender: Player, ...params: any[])=>any} method   */
    registry(key, method){this.entries.set(key.toLowerCase(),method);}
}
export const debuger = new Debuger();