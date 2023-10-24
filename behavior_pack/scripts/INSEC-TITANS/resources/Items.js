export class BetterItems{
    /**@private */
    betterItems;
    constructor(){this.betterItems = new Map();}
    set(item){this.betterItems.set(item.typeId, item);}
    delete(typeId){return this.betterItems.delete(typeId);}
    get(typeId){return this.betterItems.get(typeId).clone();}
}
export const betterItems = new BetterItems();