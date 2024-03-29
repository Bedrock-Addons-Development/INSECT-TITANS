import {
    GameMode, Player, Vector,
    EquipmentSlot, ItemStack, ItemLockMode, Dimension, BlockTypes, EffectTypes
} from "@minecraft/server";
import { InfoMapProperties, InventoryItems, ItemModifiers, MenuItemStacks, PlayerDynamicProperties, ToolSlot, ToolSlots, centerLocation } from "resources";
import { ItemStackBuilder, deathScreen } from "wrapper";

const { config: {
    default_spawn_point: spawnPoint,
    defualt_game_mode: gamemode
} } = global,
    runtimeTag = 'runtime';
const base = { x: -729, y: 172, z: -873 };
const obj = getObjective('online');
const SpawnCommands = [
    "gamemode " + gamemode,
    "inputpermission set @s camera enabled",
    "inputpermission set @s movement enabled",
    "fog @s remove test",
    "fog @s remove fog",
    "fog @s push dest:custom_fog test",
]
const DieCommands = [
    "gamemode " + GameMode.spectator,
    "inputpermission set @s camera disabled",
    "inputpermission set @s movement disabled",
    "fog @s push dest:death_fog fog"
]
const Interactions = {
    hurt: "hurt",
    hit: "hit",
    break: "break"
}
const BreakSlots = [
    ToolSlots.axe,
    ToolSlots.pickaxe
]
const HitSlots = [
    ...BreakSlots,
    ToolSlots.sword
]
const HurtSlots = [
    EquipmentSlot.Chest,
    EquipmentSlot.Legs,
    EquipmentSlot.Head,
    EquipmentSlot.Feet,
    EquipmentSlot.Offhand
]
const FixInteraction = {
    [Interactions.break]: BreakSlots,
    [Interactions.hit]: HitSlots,
    [Interactions.hurt]: HurtSlots
}
const InventoryLevels = {
    [EquipmentSlot.Head]: "armorLevel",
    [EquipmentSlot.Chest]: "armorLevel",
    [EquipmentSlot.Legs]: "armorLevel",
    [EquipmentSlot.Feet]: "armorLevel",
    [EquipmentSlot.Offhand]: "shieldLevel",
    [ToolSlot.sword]: "swordLevel",
    [ToolSlot.pickaxe]: "toolsLevel",
    [ToolSlot.axe]: "toolsLevel"
}
async function onInitSpawn(player) {
    if (!player.hasTag(runtimeTag)) return;
    await player.runCommandAsync(`scoreboard players set @s ${obj.id} 0`);
}
async function onSpawn(player) {
    player.scale = 0.7;
    if (!player.hasTag(runtimeTag)) return;
    player.addEffect("saturation", 99999999, 255, false);
    InitInventory(player).catch(errorHandle);
    RunCommands(player, SpawnCommands);
    player.teleportFacing(spawnPoint, overworld, spawnPoint);
    await shield(player, 120);
}
async function onDie(player) {
    if (!player.hasTag(runtimeTag)) return;
    RunCommands(player, DieCommands);
    for (let loc of deathScreen(spawnPoint)) {
        await nextTick;
        if (!player.isOnline) return;
        if (player.health > 0) break;
        player.teleportFacing(loc, overworld, spawnPoint);
    }
    player.teleportFacing(spawnPoint, overworld, spawnPoint);
}
/**@param {Player} player @param {keyof Interactions} interaction */
async function onInteract(player, interaction) {
    if (!player.hasTag(runtimeTag)) return;
    await nextTick;
    for (const slot of FixInteraction[interaction]) await Fix(player, slot);
}
async function onBlockBreak(player, block, permutation) {
    if (!player.hasTag(runtimeTag)) return;
    onInteract(player, Interactions.break);
    if (permutation.hasTag('stone')) global.infoMap.relative(InfoMapProperties.stones, 1);
    else if (permutation.hasTag('wood')) global.infoMap.relative(InfoMapProperties.woods, 1);
    else return;
    block.setType("invisible_bedrock");
    await sleep(180);
    block.setPermutation(permutation);
}


export async function InitInventory(player) {
    if (!player.hasTag(runtimeTag)) return;
    const { container, armor } = player;
    container.setItem(8, MenuItemStacks.Menu);
    for (const key of Object.getOwnPropertyNames(InventoryItems)) {
        await nextTick;
        if (!InventoryItems[key][player[InventoryLevels[key]]]) continue;
        const itemStack = new ItemStackBuilder(InventoryItems[key][player[InventoryLevels[key]]]).setLockMode(ItemLockMode.slot);
        if (key in ItemModifiers) ItemModifiers[key](itemStack);
        if (key in EquipmentSlot) {
            const { enchantments } = armor.getEquipment(key) ?? {};
            if (enchantments) itemStack.enchantments = enchantments;
            armor.setEquipment(key, itemStack);
        } else {
            const { enchantments } = container.getItem(ToolSlots[key]) ?? {};
            if (enchantments && enchantments.slot == itemStack.enchantments.slot) itemStack.enchantments = enchantments;
            container.setItem(ToolSlots[key], itemStack);
        }
    }
}


/** @param {Player} player */
async function shield(player, ticks = 20) {
    if (!player.hasTag(runtimeTag)) return;
    player.addEffect("instant_health", ticks, 255, false);
    while (ticks--) {
        await nextTick;
        for (const e of player.dimension.getEntities({ location: player.location, families: ["enemy"], maxDistance: 5 })) e.applyImpulse(Vector.multiply(Vector.subtract(e.location, player.location), 0.5));
    }
}
function Fix(player, slot) {
    if (!player.hasTag(runtimeTag)) return;
    const { armor, container } = player;
    if (slot in EquipmentSlot) {
        const item = armor.getEquipment(slot);
        if (!item) return;
        item.damage = 0;
        armor.setEquipment(slot, item);
    } else if (typeof slot == 'number') {
        const item = container.getItem(slot);
        if (!item) return;
        item.damage = 0;
        container.setItem(slot, item);
    }
}
function onPlayer({ player, initialSpawn }) {
    if (!player.hasTag(runtimeTag)) return onBaseSpawn(player);
    if (initialSpawn) onInitSpawn(player).catch(errorHandle);
    onSpawn(player).catch(errorHandle);
}
const EntityEventOptions = { entityTypes: ["minecraft:player"] };
async function RunCommands(target, commands) { for (const cmd of commands) target.runCommandAsync(cmd); }
afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation: permutation }) => onBlockBreak(player, block, permutation).catch(errorHandle));
afterEvents.entityHitEntity.subscribe(({ hitEntity, damagingEntity: entity }) => hitEntity ? onInteract(entity, Interactions.hit).catch(errorHandle) : null, EntityEventOptions);
afterEvents.entityHurt.subscribe(({ hurtEntity }) => onInteract(hurtEntity, Interactions.hurt).catch(errorHandle), EntityEventOptions);
afterEvents.entityDie.subscribe(({ deadEntity }) => onDie(deadEntity).catch(errorHandle), EntityEventOptions);
afterEvents.playerSpawn.subscribe(onPlayer);
for (const player of world.getPlayers()) onPlayer({ player, initialSpawn: true });

/**@type {[import("@minecraft/server").Vector3, {dimension:Dimension}]} */
const ovwBase = [base, { dimension: overworld }];
/**@param {Player} player */
function onBaseSpawn(player) {
    player.scale = 0.45;
    player.onScreenDisplay.setActionBar(' ');
    player.runCommandAsync("clear");
    player.teleport(...ovwBase);
}
/**@param {Player} player */
function startIt(player) {
    player.addTag(runtimeTag);
    onPlayer({ player, initialSpawn: true });
}
async function doLobby() {
    while (true) {
        await nextTick;
        for (const p of world.getPlayers({ excludeTags: [runtimeTag] })) {
            try {
                const { location } = p, block = p.dimension.getBlock(location);
                if (location.y < 150) p.teleport(...ovwBase);
                if (block.type == BlockTypes.get("portal")) {
                    startIt(p);
                    continue;
                }
                p.addEffect(EffectTypes.get("resistance"), 100, { amplifier: 255 });
                p.addEffect(EffectTypes.get("instant_health"), 100, { amplifier: 255 });
            } catch (error) { }
        }
    }
}
doLobby().catch(errorHandle);