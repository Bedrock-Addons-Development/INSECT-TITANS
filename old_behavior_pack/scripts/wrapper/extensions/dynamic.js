import { system, world, Player, SystemAfterEvents } from "@minecraft/server";
import { EventSignal } from "../utils.js";



const isJoined = Symbol('joined');
Player.prototype[isJoined] = true;

const joinedPlayers = new Map();
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => { if (initialSpawn) { player[isJoined] = true; joinedPlayers.set(player.id, player); } });
world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    const player = joinedPlayers.get(playerId);
    player[isJoined] = false;
    joinedPlayers.delete(playerId);
});

const gameInitialize = new EventSignal();
const tickEvent = new EventSignal();

Object.assign(SystemAfterEvents.prototype, {
    get gameInitialize() { return gameInitialize; },
    get tick() { return tickEvent; }
});

{
    const tick = { currentTick: 0, deltaTime: 0 };
    system.runInterval(() => {
        tick.currentTick = system.currentTick;
        tick.deltaTime = system.deltaTime;
        tickEvent.trigger(tick);
    });
};