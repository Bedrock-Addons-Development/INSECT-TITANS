import { ScoreboardIdentityType, ScoreboardObjective } from "@minecraft/server";
import { PromseHandle } from "./base.js";


const sets = new Map();
const splitKey = '.\n$_';
const matchRegex = /\.\n\$\_/g;
const {fakePlayer} = ScoreboardIdentityType;
const [parse,stringify] = [JSON.parse.bind(JSON),JSON.stringify.bind(JSON)]
/**
 * Database
 */
export class Database extends Map{
    /**@param {string} objective @returns {Database} */
    static createDatabase(name){
        return this.getDatabase(getObjective(name));
    }
    /**@param {ScoreboardObjective} objective @returns {Database} */
    static getDatabase(objective){
        if(!objective instanceof ScoreboardObjective) throw new TypeError("First Argument must be type of ScoreboardObjective");
        const {id} = objective
        if(sets.has(id)) return sets.get(id);
        const n = new Database(objective);
        sets.set(id,n);
        return n;
    }
    /**@param {Database} databse */
    static deleteDatabase(databse){
        if(sets.has(databse.id)) sets.delete(databse.id);
        getObjective(databse.objective,true);
        return true;
    }
    /**
     * Create a new database!
     * @protected
     * @param {ScoreboardObjective} objective
     */
    constructor(objective) {
        if(!objective instanceof ScoreboardObjective) throw new TypeError("Objective object must by type of ScoreboardObjective.");
        super();
        try {
            this.#init(objective);
        } catch (error) {
            console.error("§4§lThere was a problem loading data from the database, all data was reset");
            this.clear();
            this.#init(objective);
        }
    }
    #init(objective){
        this.#objective = objective;
        this.#id = objective.id;
        this.#participants = new Map();
        this.#awaitHandles = new Map();
        for (const p of objective.getParticipants()) {
            if(p.type == fakePlayer){
                const [key,value] = p.displayName.split(splitKey);
                const v = parse(value.replaceAll("\\\"","\""));
                super.set(key,v);
                this.#participants.set(key,p);
                this.#awaitHandles.set(key,new PromseHandle());
            }
        }
    }
    /**
     * Set a value from a key
     * @param {string} key Key to set
     * @param {any} value The value
     */
    async set(key, value) {
        if (value==undefined) throw new TypeError("Value must be defined");
        if (key.match(matchRegex)) throw new TypeError(`Database keys can't include "${splitKey}"`);
        const build = key + splitKey + stringify(value).replaceAll(/"/g, '\\"');
        if ((build.length + 1) > 32000) throw new Error(`Database setter to long... somehow`);
        let handle = this.#awaitHandles.get(key) ?? new PromseHandle();
        const handleKey = await handle.lock();
        if (this.has(key)) this.#objective.removeParticipant(this.#participants.get(key));
        await runCommand(`scoreboard players set "${build}" "${this.#id}" 0`);
        const keyId = key + splitKey;
        const p = this.#objective.getParticipants().find(({displayName:n})=>n.startsWith(keyId));
        if(p == undefined) throw new Error("Value couldn't be set!");
        this.#participants.set(key,p);
        super.set(key, value);
        this.#awaitHandles.set(key,handle);
        handle.release(handleKey);
    }
    /**
     * Delete a key from the database 
     * @param {string} key Key to delete from the database
     */
    delete(key) {
        if (key.match(matchRegex))
            throw new TypeError(`Database keys can't include "${splitKey}"`);
        if (!this.has(key)) return false;
        this.#objective.removeParticipant(this.#participants.get(key));
        this.#participants.delete(key);
        this.#awaitHandles.delete(key);
        return super.delete(key);
    }
    clear() {
        getObjective(this.#objective,true);
        this.#objective = getObjective(this.#id);
        this.#participants.clear();
        return super.clear();
    }
    #id;
    #objective;
    #participants;
    #awaitHandles = new Map();
    /**@returns {string} */
    getId(){return this.#id;}
    /**@returns {ScoreboardObjective} */
    getScoreboardObjective(){return this.#objective;}
}