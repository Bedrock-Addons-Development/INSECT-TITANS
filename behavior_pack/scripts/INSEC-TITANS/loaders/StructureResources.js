import { loader } from "./TheLoader";
import { betterEnchantments, betterItems } from "../resources/index";
import { FutureTask } from "utils/index";
import { InsectEntities, Structures } from "Definitions";



//using ticking location for manipulate or load these enchantments
const FUTURE_TASK = new FutureTask();
loader.registry(async (dimension, location) => {
    for (const entity of dimension.getEntities({type:InsectEntities.InsectInventory})) entity.remove();
    const {successCount:s1} = await dimension.runCommandAsync(`structure load ${Structures.BetterEnchantments} ${location.x} -64 ${location.y} 0_degrees `);
    const {successCount:s2} = await dimension.runCommandAsync(`structure load ${Structures.BetterItems} ${location.x} -64 ${location.y} 0_degrees `);
    if(!(s1 && s2)) console.error("Better Resources can't be loaded ", new Error().stack);
    await FUTURE_TASK;
});
let i = 0;
const job = world.afterEvents.entityLoad.subscribe(({ entity }) => {
    console.warn(entity?.typeId);
    if (entity?.typeId !== InsectEntities.InsectInventory) return;
    const inv = entity.getComponent("inventory").container;
    for (let slot = 0, size = inv.size; slot < size; slot++) {
        const item = inv.getItem(slot);
        if (!item) {
            if(i++ > 0) {
                FUTURE_TASK._resolver();
                world.afterEvents.entitySpawn.unsubscribe(job);
            }
            entity.remove();
            return;
        }
        if(item.typeId === "minecraft:book") for (const E of item.enchantments) betterEnchantments.registerEnchantment(E); 
        else betterItems.set(item);
    }
});