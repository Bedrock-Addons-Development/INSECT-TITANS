import { Enchantment, EnchantmentType, EnchantmentTypes } from "@minecraft/server";

export class BetterEnchantments{
    /**@private */
    betterEnchantments;
    constructor(){
        this.betterEnchantments = new Map();
    }
    /**@param {number} level @param {string | EnchantmentType} type  */
    getEnchantment(type,level){
        let id = type;
        if(typeof type === "string") type = EnchantmentTypes.get(type);
        if(type == undefined) throw new TypeError("Unknow type: " + id);
        if(level<=type.maxLevel){
            return new Enchantment(type,level);
        }
        const i = this.betterEnchantments.get(type);
        if(!i) return null;
        return e[level];
    }
    /**@param {Enchantment} enchantment  */
    registerEnchantment(enchantment){
        const {type,level} = enchantment;
        let base = this.betterEnchantments.get(type);
        if(!base){
            base = {};
            for (let lvl = 0; lvl <= type.maxLevel; lvl++) base[lvl] = new Enchantment(type,lvl);
        }
        base[level] = enchantment;
        this.betterEnchantments.set(type,base);
        return true;
    }
}
export const betterEnchantments = new BetterEnchantments();