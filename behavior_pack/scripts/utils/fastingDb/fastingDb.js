import { World, world } from "@minecraft/server";
const maxPropertyLength = 32767;

export class FastingDB {
    /**@private */
    storageType;
    /**@private */
    __id;
    /**@private */
    cache = new Map();

    /** @param {import("./fastingDBTypes").DbStorageType} storageType */
    constructor(storageType = world) {
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
        if (storages.length === 1) return JSON.parse(this.storageType.getDynamicProperty(storages[0]))
        return JSON.parse(storages.reduce((prev, curr) => {
            prev += this.storageType.getDynamicProperty(curr)
            return prev
        }, ""))
    }

    /**
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {
        const { storageType, __id } = this
        const data = JSON.stringify(value)

        let propertyCount = 0;
        for (let i = 0; i < maxPropertyLength; i += maxPropertyLength) {
            const chunk = data.substring(i, i + maxPropertyLength)
            storageType.setDynamicProperty(__id + key + propertyCount, chunk)
            propertyCount++
        }
        this.updateCache()
        return this
    }

    clear() {
        const { storageType, updateCache, getPropertyIds } = this
        getPropertyIds().forEach((property) => storageType.setDynamicProperty(property))
        updateCache()
    }

    /**
     * @param {string} key
     */
    delete(key) {
        const { storageType, updateCache, getPropertyIds } = this
        const props = getPropertyIds(key)
        if (props.length === 0) return false
        props
            .forEach((property) => storageType.setDynamicProperty(property))
        updateCache()
        return true
    }

    get size() {
        const { getPropertyIds } = this
        return getPropertyIds().length
    }

    *entries() {
        const { __id, get, getPropertyIds } = this
        const props = getPropertyIds()
        /** @type {string[]}*/
        const keys = []
        for (const prop of props) {
            const key = prop.substring(__id.length)
            if (keys.includes(key)) continue
            keys.push(key)
            yield get(key)
        }
    }

    /** @param {string} key*/
    has(key) {
        const { getPropertyIds } = this
        return !!getPropertyIds(key)
    }

    forEach() {
        throw new Error("Method Not Implemented.")
    }

    keys() {
        throw new Error("Method Not Implemented.")
    }

    values() {
        throw new Error("Method Not Implemented.")
    }
}