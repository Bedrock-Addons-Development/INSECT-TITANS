import * as MC from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { PlayerDynamicProperties } from "resources";

const {
    EntityInventoryComponent: { componentId: inventoryId },
    EntityEquippableComponent: { componentId: equipmentId },
    EntityHealthComponent: { componentId: healthId },
    EntityScaleComponent: { componentId: scaleId },
    ItemEnchantsComponent: { componentId: enchantmentsId },
    ItemDurabilityComponent: { componentId: durabilityId },
    MinecraftDimensionTypes: { overworld, nether, theEnd },
    world, system
} = MC;



const EntityProperties = {
    toString: { value() { return `[Entity: ${this.typeId}]`; } },
    inventory: { get() { return this.getComponent(inventoryId) } },
    container: { get() { return this.getComponent(inventoryId)?.container } },
    armor: { get() { return this.getComponent(equipmentId); } },
    health: { get() { return this.getComponent(healthId)?.current }, set(n) { this.getComponent('health').setCurrent(n) } },
    maxHealth: { get() { return this.getComponent(healthId)?.value } },
    viewBlock: { get() { return this.getBlockFromViewDirection({ maxDisatnce: 10, includePassableBlocks: true }); } },
    viewEntities: { get() { return this.getEntitiesFromViewDirection({ maxDisatnce: 10 }); } },
    applyDamage: { value(amount, source) { this.applyDamage.call(this, amount, source); } },
    isValidHandle: { get() { try { this.id; return true; } catch { return false; } } },
    scale: { get() { return this.getComponent(scaleId).value }, set(v) { return this.getComponent(scaleId).value = v } },
};
{
    const proxies = new WeakMap();
    const createProxy = source => {

    };
    EntityProperties.scores = {
        get() {
            const entity = this, { scoreboardIdentity: sbId } = this;
            return new Proxy({}, {
                get(_, o) { try { return sbId.getScore(getObjective(o)); } catch { return 0 } },
                set(_, o, n) {
                    if (!sbId) return entity.runCommand(`scoreboard players set @s "${o}" ${n}`);
                    return o = getObjective(o), scoreboard.setScore(o, sbId, n);
                }
            })
        }
    }
}
const PlayerProperties = {
    getGameMode: { vlaue() { return Object.getOwnPropertyNames(GameMode).find(gameMode => world.getPlayers({ name: this.name, gameMode }).length) ?? "defualt" } },
    setGameMode: { value(mode) { return this.runCommandAsync("gamemode " + mode); } },
    toString: { value() { return `[Player: ${this.name}]`; } },
    mainhand: {
        get() { return this.armor.getEquipmentSlot("mainhand"); },
        set(s) { this.armor.setEquipment("mainhand", s); return s; }
    },
    blueXp: {
        get() { return this.getDynamicProperty(PlayerDynamicProperties.BlueXp) ?? 0 },
        set(v) { return this.setDynamicProperty(PlayerDynamicProperties.BlueXp, v) }
    },
    armorLevel: {
        get() { return this.getDynamicProperty(PlayerDynamicProperties.Armor) ?? 0 },
        set(v) { return this.setDynamicProperty(PlayerDynamicProperties.Armor, v) }
    },
    swordLevel: {
        get() { return this.getDynamicProperty(PlayerDynamicProperties.Sword) ?? 0 },
        set(v) { return this.setDynamicProperty(PlayerDynamicProperties.Sword, v) }
    },
    toolsLevel: {
        get() { return this.getDynamicProperty(PlayerDynamicProperties.Tools) ?? 0 },
        set(v) { return this.setDynamicProperty(PlayerDynamicProperties.Tools, v) }
    },
    shieldLevel: {
        get() { return this.getDynamicProperty(PlayerDynamicProperties.Shield) ?? 0 },
        set(v) { return this.setDynamicProperty(PlayerDynamicProperties.Shield, v) }
    },
    confirm: {
        async value(body, title = "form.confirm.title") {
            const confirm = new MessageFormData();
            confirm.body(body ?? "")
            confirm.title(title)
            confirm.button2("form.close");
            confirm.button1("form.confirm.button");
            const { output, canceled } = await confirm.show(this);
            return (!canceled) && (output == 1);
        }
    },
    info: {
        async value(body, title = "form.info.title") {
            const info = new ActionFormData();
            info.body(body ?? "")
            info.title(title)
            info.button("form.ok");
            return info.show(this);
        }
    }
}
const ContainerProperties = {
    [Symbol.iterator]: { *value() { for (let i = 0; i < this.emptySlotsCount; i++) yield this.getSlot(i); } }
}
const ItemStackProperties = {
    enchantments: {
        get() { return this.getComponent(enchantmentsId).enchantments; },
        set(enchs) { return this.getComponent(enchantmentsId).enchantments = enchs; }
    },
    damage: {
        get() { return this.getComponent(durabilityId).damage; },
        set(value) { return this.getComponent(durabilityId).damage = value; }
    }
}
const BlockProperties = {
    canBeWaterlogged: { get() { return this.type.canBeWaterlogged } },
    inventory: { get() { return this.getComponent(inventoryId) } },
    container: { get() { return this.getComponent(inventoryId)?.container; } },
    setBlock: {
        value(type) {
            if (type instanceof MC.BlockPermutation) this.setPermutation(type);
            else this.setType(type);
        }
    }
}
const WorldProperties = {
    overworld: { value: world.getDimension(overworld) },
    nether: { value: world.getDimension(nether) },
    theEnd: { value: world.getDimension(theEnd) },
    time: { get() { return this.getTime(); }, set(num) { return this.setTime(num); } },
    find: {
        value(entity, queryOptions) {
            queryOptions.location = entity.location;
            queryOptions.closest = 1;
            delete queryOptions.farthest;
            for (const e of entity.dimension.getEntities(queryOptions)) {
                if (entity == e) return e;
            }
            return false;
        }
    }
}
const DimensionProperties = {
    setBlock: { value: function setBlock(loc, permutation) { return this.fillBlocks(loc, loc, permutation); } }
}
const SystemProperties = {
    nextTick: { get() { return new Promise(res => this.run(res)); } }
}


//prototypes
Object.defineProperties(MC.Entity.prototype, EntityProperties);
Object.defineProperties(MC.Player.prototype, PlayerProperties);
Object.defineProperties(MC.Container.prototype, ContainerProperties);
Object.defineProperties(MC.ItemStack.prototype, ItemStackProperties);
Object.defineProperties(MC.Block.prototype, BlockProperties);
Object.defineProperties(MC.World.prototype, WorldProperties);
Object.defineProperties(MC.Dimension.prototype, DimensionProperties);
Object.defineProperties(MC.System.prototype, SystemProperties);




const EnchantmentType = {
    Custom: MC.Enchantment.Custom ?? {}
}
const VectorType = {
    from({ x, y, z }) { return new this(x, y, z); },
    normalized(loc) {
        return this.from(loc).normalized();
    },
    dot(l1, l2) {
        return l1.x * l2.x + l1.y * l2.y + l1.z * l2.z;
    },
    equals(l1, l2) { return l1.x == l2.x && l1.y == l2.y && l1.z == l2.z }
}
//types
Object.assign(MC.Vector, VectorType);
Object.assign(MC.Enchantment, EnchantmentType);