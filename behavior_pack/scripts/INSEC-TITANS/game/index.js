import { game } from "../core/index";

game.onInitialize.subscribe(()=>{
    console.warn("Initialized");
});
const [p] = world.getAllPlayers();
if(p) game.onInitialize.trigger({dimension:p.dimension,location:p.location,game});
world.afterEvents.playerSpawn.subscribe(({initialSpawn,player})=>{
    if(initialSpawn && !game.isInitialized) if(p) game.onInitialize.trigger({dimension:player.dimension,location:player.location,game});
});