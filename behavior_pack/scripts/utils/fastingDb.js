import { World, world, Entity } from "@minecraft/server";
const maxPropertyLength = 32000;

// prevents multiple instances for one dynamic property source
const DB_Instances = new WeakMap();


export class FastingDB {
    /**@private */
    storageType;
    /**@private */
    __id;
    /**@private */
    cache = new Map();
    /** @param {World | Entity | undefined} storageType */
    constructor(storageType = world) {
        if (DB_Instances.has(storageType)) return DB_Instances.get(storageType);
        DB_Instances.set(storageType, this);
        this.storageType = storageType;
        this.__id = (storageType instanceof World) ? "WORLD_db_" : storageType.id + "_db_"
    }
    /**
     * Returns A Filtered List Of Property Ids That Are Valid DB Entires
     * @private
     * @param {string | undefined} key 
     * @returns {Array<string>}
     */
    getPropertyIds(key = undefined) {
        return this.filtered(this.getPropertyIdsFromCache(), key)
    }
    /**
     * Rebuilds The Property Id Cache System
     * @private 
     **/
    updateCache() {
        const allProps = this.storageType.getDynamicPropertyIds()
        this.cache.set("ids", allProps)
        return allProps
    }
    /**
     * Returns Property IDs From The DB From The Cache And Rebuilds The Cahce If No Cached Data Exists
     * @private
     * @returns {Array<string>}
     */
    getPropertyIdsFromCache() {
        if (this.cache.has("ids")) return this.cache.get("ids")
        return this.updateCache()
    }
    /**
     * Returns An Array Of Elements Where Each Element Has To Start With The Entities Id And An Optional Key
     * @private
     * @param {Array<string>} val 
     * @param {string | undefined} key 
     * @returns {Array<string>}
     */
    filtered(val, key = undefined) {
        const { __id } = this
        return key ? val.filter(x => x.startsWith(__id + key)) : val.filter(x => x.startsWith(__id))
    }
    /**
     * @param {string} key 
     */
    get(key) {
        const storages = this.getPropertyIds(key)
        if (storages.length === 1) {

            const nativeType = storages[0]
            if (
                typeof nativeType == "boolean"
                || typeof nativeType == "number"
                || (Object.keys(nativeType).join("") === "xyz")
            ) return nativeType
            return JSON.parse(this.storageType.getDynamicProperty(storages[0]))
        }
        return JSON.parse(storages.reduce((prev, curr) => {
            prev += this.storageType.getDynamicProperty(curr)
            return prev
        }, ""))
    }


    /**
     * @private
     * @param {string} key 
     * @param {any} value 
     */
    setString(key, value) {
        const { storageType, __id } = this
        const data = JSON.stringify(value)

        let propertyCount = 0;
        for (let i = 0; i < data.length; i += maxPropertyLength) {
            const chunk = data.substring(i, i + maxPropertyLength)
            storageType.setDynamicProperty(__id + key + propertyCount, chunk)
            propertyCount++
        }
    }


    /**
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {
        const { storageType, __id } = this

        switch (typeof data) {
            case "number": { storageType.setDynamicProperty(__id + key + "0", data); break }
            case "boolean": { storageType.setDynamicProperty(__id + key + "0", data); break }
            case "object": {
                Object.keys(data).join("") === "xyz" ?
                    storageType.setDynamicProperty(__id + key + "0", data)
                    : this.setString(key, value)
            }
            default: {
                this.setString(key, value)
            }
        }
        this.updateCache()
        return this
    }

    clear() {
        const { storageType } = this
        this.getPropertyIds().forEach((property) => storageType.setDynamicProperty(property))
        this.updateCache()
    }

    /**
     * @param {string} key
     */
    delete(key) {
        const { storageType } = this
        const props = this.getPropertyIds(key)
        if (props.length === 0) return false
        props
            .forEach((property) => storageType.setDynamicProperty(property))
        this.updateCache()
        return true
    }
    get size() {
        return this.getPropertyIds().length
    }
    entries() {
        return this.constuctEntries()
    }
    /** @param {string} key*/
    has(key) {
        return !!this.getPropertyIds(key)
    }
    /** @param {(value : any, key : string, map : FastingDB) => void} func  */
    forEach(func) {
        const entries = this.constuctEntries()
        for (const [key, value] of entries) func(value, key, this)
    }
    *keys() {
        const entries = this.constuctEntries(true)
        for (const [key] of entries) yield key
    }
    *values() {
        const entries = this.constuctEntries()
        for (const [_, value] of entries) yield value
    }

    /** 
     * @param {boolean} [skipGet=false] 
     * @private 
     */
    *constuctEntries(skipGet = false) {
        const { __id } = this
        const props = this.getPropertyIds()
        /** @type {string[]}*/
        const keys = []
        for (const prop of props) {
            const key = prop.substring(__id.length)
            if (keys.includes(key)) continue
            keys.push(key)
            yield [key, skipGet ? null : this.get(key)]
        }
    }
}