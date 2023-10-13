class FastingDB extends Map {
    storageType;
    __id;
    /**
     * @param {import(".").DbStorageType} storageType 
     */
    constructor(storageType) {
        this.storageType = storageType
        this.__id = storageType.id
    }


    /** @private */
    parseRecursive() {
        
    }

    /**
     * @param {string} key 
     */
    get(key) {

    }


    /**
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {

    }

}