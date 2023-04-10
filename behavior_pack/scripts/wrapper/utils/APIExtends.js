import { ActionFormData } from "@minecraft/server-ui";
import { ItemStack } from '@minecraft/server';

export class MenuFormData extends ActionFormData{
    #actions;
    #onClose;
    constructor(){
        super();
        this.#actions = [];
        this.#onClose = ()=>{};
    }
    onClose(onClose){this.#onClose = onClose;}
    addAction(action,content,icon = undefined){
        this.#actions.push(action??(()=>undefined));
        this.button(...[content,icon]);
        return this;
    }
    async show(player){
        const {output,canceled} = await super.show(player);
        return canceled?(await this.#onClose(player)):(await this.#actions[output]?.(player));
    }
}
const _setCanDestroy = ItemStack.prototype.setCanDestroy;
export class ItemStackBuilder extends ItemStack{
    setNameTag(n){this.nameTag = n;return this;}
    setLockMode(n){this.lockMode = n;return this;}
    setKeepOnDeath(n){this.keepOnDeath = n;return this;}
    setCanDestroy(canDestroy){_setCanDestroy.call(this,canDestroy); return this;}
}