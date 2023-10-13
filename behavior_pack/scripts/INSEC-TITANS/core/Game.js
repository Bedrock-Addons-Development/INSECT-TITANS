import {NativeEvent} from "con-api";

export class Game{
    constructor(){
        this.onInitialize = new NativeEvent();
        this.onStart = new NativeEvent();
    }
    getAllGamers(){
        return world.getPlayers({tags:["gaming"]});
    }
}
export const game = new Game();