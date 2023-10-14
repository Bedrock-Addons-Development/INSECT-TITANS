import {system} from "@minecraft/server";

declare module "@minecraft/server"{
    interface Player{
        isPlaying: boolean,
        mana: number,
        iron: number,
        wood: number,
        stone: number
    }
}