import { loader } from "./TheLoader";
import { betterEnchantments, InsectEntities } from "../resources/index";
import { FutureTask } from "utils/index";


//using ticking location for manipulate or load these enchantments
const FUTURE_TASK = new FutureTask();
loader.registry(async (dimension, location) => {
    await dimension.runCommandAsync("say Hi")
    await FUTURE_TASK.then(()=>console.warn("Then"));
});



const job = world.afterEvents.entityLoad.subscribe(({ entity }) => {
    if (entity?.typeId !== InsectEntities.InsectInventory) return;
    const inv = entity.getComponent("inventory").container;
    for (let slot = 0, size = inv.size; slot < size; slot++) {
        const item = inv.getItem(slot);
        if (!item) {
            FUTURE_TASK.resolver();
            world.afterEvents.entitySpawn.unsubscribe(job);
            entity.remove();
        }
        for (const E of item.enchantments) betterEnchantments.registerEnchantment(E); 
    }
});