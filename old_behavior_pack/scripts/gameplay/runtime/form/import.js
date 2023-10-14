import './abilities.js';
import './Towers.js';
import './wallBuilder.js';
import { EventTypes, IsBusy, MainMenu, SetBusy, ValidItemStack, runAction, setDefaultAction } from './default.js';
import { MenuFormData } from 'wrapper.js';

beforeEvents.itemUse.subscribe(ev => run(ev.source, ev, EventTypes.beforeItemUse).catch(errorHandle));
beforeEvents.itemUseOn.subscribe(ev => run(ev.source, ev, EventTypes.beforeItemUseOn).catch(errorHandle));
afterEvents.entityHitEntity.subscribe(ev => run(ev.damagingEntity, ev, EventTypes.entityHit).catch(errorHandle), { entityTypes: ["minecraft:player"] });

/**@type {(player:import('@minecraft/server').Player, data: object, eventType: keyof EventTypes)=>Promise<void>}*/
async function run(player, data, eventType) {
    if (IsBusy(player)) return;
    if (!ValidItemStack(player)) return;
    SetBusy(player, true);
    await runAction(player, data, eventType).catch(errorHandle);
    SetBusy(player, false);
}

async function defaultAction(player) {
    const Menu = new MenuFormData();
    Menu.title('form.settings.title')
        .body('form.settings.body')
    for (const key of Object.getOwnPropertyNames(MainMenu)) {
        const { action, icon, content } = MainMenu[key];
        Menu.addAction(action, content, icon);
    }
    Menu.addAction(() => { }, "form.close");
    await Menu.show(player);
}
setDefaultAction(defaultAction);