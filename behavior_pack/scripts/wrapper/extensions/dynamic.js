import { SystemEvents, system, world, Player } from "@minecraft/server";
import { EventSignal } from "../utils.js";



const isJoined = Symbol('joined');
Player.prototype[isJoined] = true;

const joinedPlayers = new Map();
world.events.playerSpawn.subscribe(({player,initialSpawn})=>{if(initialSpawn) { player[isJoined] = true; joinedPlayers.set(player.id,player);}});
world.events.playerLeave.subscribe(({playerId})=>{
    const player = joinedPlayers.get(playerId);
    player[isJoined] = false;
    joinedPlayers.delete(playerId);
});

const gameInitialize = new EventSignal();
const tickEvent = new EventSignal();

Object.defineProperties(SystemEvents.prototype,{
    gameInitialize:{get(){return gameInitialize;}},
    tick:{get(){return tickEvent;}}
});
system.runInterval(()=>tickEvent.trigger({currentTick:system.currentTick,deltaTime:system.deltaTime}));