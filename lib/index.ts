export const sleep = (msec: number) => {
    return new Promise((resolve) => setTimeout(resolve, msec))
  }
  
  export * from "./discord"
  export * from "./spotify"