import { Player } from "@minecraft/server";
import { OverTakes } from "con-api";

OverTakes(Player.prototype,{
    get isPlaying(){return this.hasTag("gaming");},
    set isPlaying(v){return v?this.addTag("gaming"):this.removeTag("gaming");},
    get mana(){return this.getDynamicProperty("resources_mana")??0;},
    set mana(v){return  this.setDynamicProperty("resources_mana", v);},
    get iron(){return this.getDynamicProperty("resources_iron")??0;},
    set iron(v){return  this.setDynamicProperty("resources_iron", v);},
    get wood(){return this.getDynamicProperty("resources_wood")??0;},
    set wood(v){return  this.setDynamicProperty("resources_wood", v);},
    get stone(){return this.getDynamicProperty("resources_stone")??0;},
    set stone(v){return  this.setDynamicProperty("resources_stone", v);}
});