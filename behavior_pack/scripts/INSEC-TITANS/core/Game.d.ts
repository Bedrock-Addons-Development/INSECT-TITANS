import { Player } from "@minecraft/server";
import { NativeEvent, Vec3 } from "con-api";
export class Game{
    private constructor();
    readonly onBeforeInitialize: NativeEvent<[{game: Game}]>;
    readonly onInitialize: NativeEvent<[{game: Game}]>;
    readonly onStart: NativeEvent<[{game: Game}]>;
    readonly onReady: NativeEvent<[{game: Game}]>;
    readonly spawnPointLobby: Vec3;
    readonly spawnPointGame: Vec3;
    getAllGamers(): Player[]
}
export const game: Game;