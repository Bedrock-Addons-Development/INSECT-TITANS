import { Player, world } from "@minecraft/server";

export class Debuger{
    constructor(){
        this.entries = new Map();
        world.beforeEvents.chatSend.subscribe(async e=>{
            if(e.message.startsWith("!")){
                e.cancel = true;
                await null;
                const [key, ...params] = e.message.substring(1).split(/[ ]+/g);
                if(!this.entries.has(key?.toLocaleLowerCase())) return e.sender.sendMessage("No action for: " + key);
                this.entries.get(key?.toLocaleLowerCase())(e.sender,...params);
            }
        });
    }
    /**@param {string} key @param {(sender: Player, ...params: any[])=>any} method   */
    registry(key, method){this.entries.set(key.toLowerCase(),method);}
}
export const debuger = new Debuger();