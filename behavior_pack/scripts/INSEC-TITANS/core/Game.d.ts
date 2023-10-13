import { NativeEvent } from "con-api";
export class Game{
    private constructor();
    readonly onInitialize: NativeEvent<[{game:Game}]>;
}
export const game: Game;