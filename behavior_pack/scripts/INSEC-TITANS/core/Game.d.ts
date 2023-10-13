import { Player } from "@minecraft/server";
import { NativeEvent } from "con-api";
export class Game{
    private constructor();
    readonly onInitialize: NativeEvent<[{game: Game}]>;
    readonly onStart: NativeEvent<[{game: Game}]>;
    getAllGamers(): Player[]
}
export const game: Game;