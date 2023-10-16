import {NativeEvent, Vec3} from "con-api";

export class Game{
    constructor(isDebuging){
        this.isDebuging = isDebuging;
        this.isInitialized = false;
        this.onBeforeInitialize = new NativeEvent();
        this.onInitialize = new NativeEvent();
        this.onReady = new NativeEvent();
        this.onStart = new NativeEvent();
        this.spawnPointLobby = Vec3.zero;
        this.spawnPointGame = Vec3.zero;
        this.onInitialize.subscribe(()=>this.isInitialized = true);
    }
    getAllGamers(){
        return world.getPlayers({tags:["gaming"]});
    }
}
export const game = new Game(false);