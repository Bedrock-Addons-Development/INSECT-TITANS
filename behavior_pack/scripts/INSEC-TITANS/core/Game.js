import {NativeEvent} from "con-api";
export class Game{
    constructor(){
        this.onInitialize = new NativeEvent();
    }
}
export const game = new Game();