import { ItemStack } from "@minecraft/server";
import { game } from "INSEC-TITANS/core/index";
import { betterEnchantments } from "INSEC-TITANS/resources/index";

game.onReady.subscribe(()=>{
    console.warn("Game is Ready");
    for (const player of system.onlinePlayers) {
        const item = new ItemStack("netherite_pickaxe");
        const list = item.enchantments;
        list.addEnchantment(betterEnchantments.getEnchantment("fortune",99));
        item.enchantments = list;
        player.container.addItem(item);
    }
});