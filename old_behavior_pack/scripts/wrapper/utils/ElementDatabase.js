import { ScoreboardObjective } from '@minecraft/server';
import { DisposableHandle} from './base.js';
import {Database} from './ObjectiveDatabase.js';

export class ElementDatabase extends Database{
    #elements;
    constructor(objective){
        if(typeof objective == 'string') objective = getObjective(objective);
        if(!objective instanceof ScoreboardObjective) throw new TypeError("Is not instanceof of ScoreboardObjective");
        super(objective);
        this.#elements = new Map();
    }
    async createElement(value,construct = Element){
        const uid = Number.createUID();
        await this.set(uid,value);
        const element = new construct(this,uid);
        this.#elements.set(uid,element);
        return element;
    }
    /**@returns {Element} */
    getElement(elementId,construct = Element){
        if(!this.has(elementId)) throw new ReferenceError(`Element for id: ${elementId} does not exist.`);
        if(this.#elements.has(elementId)){return this.#elements.get(elementId);}
        else{
            this.#elements.set(elementId, new construct(this,elementId));
            return this.#elements.get(elementId);
        }
    }
    hasElement(elementId){return this.has(elementId);}
    async delete(elementId){
        if(this.#elements.has(elementId)) {
            this.#elements.get(elementId).dispose();
            return this.#elements.delete(elementId);
        }
        return super.delete(elementId);
    }
    async deleteElement(elementId){return await this.delete(elementId);}
}

export class Element extends DisposableHandle{
    #data;
    #id;
    #database;
    /**@param {ElementDatabase} elementDatase @param {string} elementId */
    constructor(elementDatase, elementId){
        super(
            async ()=>{await elementDatase.set(elementId,this.#data);},
            ()=>{this.#database = undefined;}
        );
        this.#database = elementDatase;
        this.#id = elementId;
        this.#data = elementDatase.get(elementId);
    }
    get(key){return this.#data[key];}
    has(key){return Object.prototype.hasOwnProperty.call(this.#data,key);}
    async set(key,value){this.#data[key] = value; await this.update();}
    async delete(key){this.#data[key] = undefined; await this.update();}

    getId(){return this.#id;}
    getDatabase(){return this.#database;}
    async setData(value){this.#data = value; return await this.update(); }
    getData(){return this.#data;}
    async getDefault(property, defaultValue=0){
        if(!this.has(property)) await this.set(property,defaultValue);
        return this.get(property);
    }
}
