import { ItemStack } from "@minecraft/server";
import { game } from "INSEC-TITANS/core/index";
import { betterEnchantments, betterItems } from "INSEC-TITANS/resources/index";

game.onReady.subscribe(()=>{
    console.warn("Game is Ready");
    for (const player of system.onlinePlayers) {
        const item = betterItems.get("minecraft:netherite_pickaxe");
        const list = item.enchantments;
        list.addEnchantment(betterEnchantments.getEnchantment("fortune",10));
        list.addEnchantment(betterEnchantments.getEnchantment("efficiency",99));
        item.enchantments = list;
        player.container.addItem(item);
    }
});