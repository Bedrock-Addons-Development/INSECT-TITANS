export function FutureTask(){
    let ress, rejj;
    const object = Reflect.construct(Promise,[(res,rej)=>{ress = res;rejj = rej;}]);
    object._resolver = ress;
    object._rejector = rejj;
    return object;
}