interface FutureTask<T = any> extends Promise<T> {
    resolver: (data: T)=>void
    rejector: (error: any)=>void
}
interface FutureTaskConstructor{
    (): FutureTask
    new (): FutureTask
}
export const FutureTask: FutureTaskConstructor;