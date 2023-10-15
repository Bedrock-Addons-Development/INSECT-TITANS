import { loader } from "./TheLoader";
import { betterEnchantments, InsectEntities } from "../resources/index";

//using better enchantments for registring new enchantments, other files should not import loaders!
const DEFINED_ENCHANTMENTS = new Set();

//using ticking location for manipulate or load these enchantments
loader.registry(async (tickingLocation) => {
});

{
    //world.overworld.runCommand("tickingarea add circle 0 0 0 0 o")
    world.overworld.runCommandAsync("structure load x_enchantments 0 130 0");
    let spawned = world.afterEvents.entityLoad.subscribe(({ entity }) => {
        if (entity?.typeId !== "dest:database") return;
        const inv = entity.getComponent("inventory").container;
        for (let slot = 0, size = inv.size; slot < size; slot++) {
            const item = inv.getItem(slot);

            if (!item) {
                spawned = world.afterEvents.entitySpawn.unsubscribe(spawned);
                //world.overworld.runCommand("tickingarea remove o");
                // console.warn(JSON.stringify(x_enchantments, 0, 6));
                return entity.remove();
            }

            const enchList = item.enchantments;
            for (const E of enchList) {
                const { type: { id }, level } = E;
                x_enchantments[id] ? x_enchantments[id][level] = E : x_enchantments[id] = { [level]: E };
            }
        }
    })
}