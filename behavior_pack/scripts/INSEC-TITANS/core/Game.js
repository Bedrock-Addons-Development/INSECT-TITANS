import {NativeEvent, Vec3} from "con-api";

export class Game{
    constructor(){
        this.onBeforeInitialize = new NativeEvent();
        this.onInitialize = new NativeEvent();
        this.onReady = new NativeEvent();
        this.onStart = new NativeEvent();
        this.spawnPointLobby = Vec3.zero;
        this.spawnPointGame = Vec3.zero;
        system.run(()=>this.onBeforeInitialize.trigger({game:this}));
    }
    getAllGamers(){
        return world.getPlayers({tags:["gaming"]});
    }
}
export const game = new Game();