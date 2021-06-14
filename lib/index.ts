export const sleep = (msec: number) => {
    return new Promise((resolve) => setTimeout(resolve, msec))
  }

type QueryFn = (...args: any) => Promise<any>;
type Await<T> = T extends PromiseLike<infer U> ? U : T;
type PromiseReturnType<T extends (...args: any) => Promise<any>> = Await<ReturnType<T>>;

export const handler = async <T extends QueryFn, TR = PromiseReturnType<T>>(promiseHandler : QueryFn, input: any): [TR]=> {
    let retry: number = 0
    while( retry < 3){
      const response =  await promiseHandler(input)
      if(response.statusCode === 200) {
        return response
      }
      console.log(`retry because ${response}`)
      retry += 1
      sleep(1000)
    }
    return await promiseHandler(input)
}
  
  export * from "./discord"
  export * from "./spotify"