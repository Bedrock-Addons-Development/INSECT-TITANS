interface FutureTask<T = any> extends Promise<T> {
    _resolver: (data: T)=>void
    _rejector: (error: any)=>void
}
interface FutureTaskConstructor{
    (): FutureTask
    new (): FutureTask
}
export const FutureTask: FutureTaskConstructor;