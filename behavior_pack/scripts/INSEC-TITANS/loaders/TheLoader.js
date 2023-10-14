import { game } from "INSEC-TITANS/core/index";

export class Loader{
    constructor(){
        this.methods = new Set();
        game.onInitialize.subscribe(()=>this.start());
    }
    /**@returns {Promise<any[]>} */
    start(){
        const tasks = [];
        for (const method of this.methods) tasks.push((async ()=>method(game))().catch(displayError));
        const data = await Promise.all();
        game.onReady.trigger({game});
        return data;
    }
    /**@param {(...any: any)=>any} method */
    registry(method){
        this.methods = method;
    }
}
export const loader = new Loader();