export function FutureTask(){
    let ress, rejj;
    const object = Reflect.construct(Promise,[(res,rej)=>{ress = res;rejj = rej;}],new.target??FutureTask);
    object.resolver = ress;
    object.rejector = rejj;
    return object;
}
Object.setPrototypeOf(FutureTask.prototype,Promise.prototype);
Object.setPrototypeOf(FutureTask,Promise);