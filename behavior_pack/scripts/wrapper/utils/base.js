export class EventSignal{
    #methods = {};
    #symbol = Symbol('current');
    async trigger(...params){
        const promises = [];
        let successCount = 0;
        for (const sym of Object.getOwnPropertySymbols(this.#methods)) {
            try {
                promises.push(this.#methods[sym](...params));
            } catch (error) {
                errorHandle(error);
            }
        }
        const settled = await Promise.allSettled(promises);
        for (const {reason,status} of settled) {
            if(status == 'rejected') errorHandle(reason);
            else successCount++;
        }
        return successCount;
    }
    subscribe(method){
        if(Object.prototype.hasOwnProperty.call(method,this.#symbol)) return;
        const key = Symbol('key');
        method[this.#symbol] = key;
        this.#methods[key] = method;
        return method;
    }
    unsubscribe(method){
        if(!Object.prototype.hasOwnProperty.call(method,this.#symbol)) return;
        delete this.#methods[method[this.#symbol]];
        delete method[this.#symbol];
        return method;
    }
}
export class DisposableHandle{
    #disposed;
    #onUpdate;
    #onDispose;
    constructor(onUpdate, onDispose){
        this.#disposed = false;
        this.#onUpdate = onUpdate;
        this.#onDispose = onDispose;
    }
    async update(){
        if(this.isDisposed) throw new ReferenceError("This object handle is disposed, you can´t update it.");
        return await this.#onUpdate(this);
    }
    dispose(){
        const close = this.#onDispose;
        this.#disposed = true;
        this.#onUpdate = undefined;
        this.#onDispose = undefined; 
        close?.(this);
    }
    get isDisposed(){return this.#disposed};
}
export class PromseHandle{
    #promise = Promise.resolve();
    #id = 0;
    #map = new Map();
    release(id){
        if(!this.#map.has(id)) throw new ReferenceError("Invalid promise id resolved!");
        const res = this.#map.get(id);
        this.#map.delete(id);
        res();
        return true;
    }
    async lock(){
        const promise = this.#promise;
        const id = this.#id++;
        this.#promise = new Promise((res)=>this.#map.set(id,res));
        await promise;
        return id;
    }
    then(callBack){return this.lock().then(callBack);}
}