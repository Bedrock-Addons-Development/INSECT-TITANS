import { Dimension } from "@minecraft/server";
import { game } from "INSEC-TITANS/core/index";

export class Loader{
    constructor(){
        this.methods = new Set();
        game.onInitialize.subscribe((source)=>this.start(source));
    }
    /**@returns {Promise<any[]>} */
    async start(source){
        const tasks = [];
        console.warn(JSON.stringify(source.location));
        for (const method of this.methods) 
            tasks.push((async (obj)=>method(obj.dimension,obj.location))(source).catch(displayError));
        const data = await Promise.all(tasks);
        game.onReady.trigger({game});
        return data;
    }
    /**@param {(dimension: Dimension, location: import("@minecraft/server").Vector3)=>any} method */
    registry(method){
        this.methods.add(method);
    }
}
export const loader = new Loader();