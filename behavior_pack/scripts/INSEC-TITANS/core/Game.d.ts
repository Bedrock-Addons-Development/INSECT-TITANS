import { Player, Vector3 } from "@minecraft/server";
import { NativeEvent, Vec3 } from "con-api";
export class Game{
    private constructor(debuging: boolean);
    readonly isDebuging: boolean
    readonly isInitialized: boolean
    readonly onInitialize: NativeEvent<[{game: Game, dimension: Dimension, location: Vector3}]>;
    readonly onStart: NativeEvent<[{game: Game}]>;
    readonly onReady: NativeEvent<[{game: Game}]>;
    readonly spawnPointLobby: Vec3;
    readonly spawnPointGame: Vec3;
    getAllGamers(): Player[]
}
export const game: Game;