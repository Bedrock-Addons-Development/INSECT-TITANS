import { loader } from "./TheLoader";

const x_enchantments = {};
loader.registry(async () => {
});

{
    world.overworld.runCommand("tickingarea add circle 0 0 0 0 o")
    world.overworld.runCommandAsync("structure load x_enchantments 0 130 0");
    let spawned = world.afterEvents.entityLoad.subscribe(({ entity }) => {
        if (entity?.typeId !== "dest:database") return;
        const inv = entity.getComponent("inventory").container;
        for (let slot = 0, size = inv.size; slot < size; slot++) {
            const item = inv.getItem(slot);

            if (!item) {
                spawned = world.afterEvents.entitySpawn.unsubscribe(spawned);
                world.overworld.runCommand("tickingarea remove o");
                // console.warn(JSON.stringify(x_enchantments, 0, 6));
                return entity.remove();
            }

            const enchList = item.getComponent("enchantments").enchantments;
            for (const E of enchList) {
                const { type: { id }, level } = E;
                x_enchantments[id] ? x_enchantments[id][level] = E : x_enchantments[id] = { [level]: E };
            }
        }
    })
}