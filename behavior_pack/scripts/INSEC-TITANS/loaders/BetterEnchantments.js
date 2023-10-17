import { loader } from "./TheLoader";
import { betterEnchantments } from "../resources/index";
import { FutureTask } from "utils/index";
import { InsectEntities, Structures } from "Definitions";



//using ticking location for manipulate or load these enchantments
const FUTURE_TASK = new FutureTask();
loader.registry(async (dimension, location) => {
    const {successCount} = await dimension.runCommandAsync(`structure load ${Structures.BetterEnchantments} ${location.x} -64 ${location.y} 0_degrees `);
    if(!successCount) console.error("Better Enchantments can't load in ", new Error().stack);
    await FUTURE_TASK;
});



const job = world.afterEvents.entityLoad.subscribe(({ entity }) => {
    if (entity?.typeId !== InsectEntities.InsectInventory) return;
    const inv = entity.getComponent("inventory").container;
    for (let slot = 0, size = inv.size; slot < size; slot++) {
        const item = inv.getItem(slot);
        if (!item) {
            FUTURE_TASK._resolver();
            world.afterEvents.entitySpawn.unsubscribe(job);
            entity.remove();
            return;
        }
        for (const E of item.enchantments) betterEnchantments.registerEnchantment(E); 
    }
});