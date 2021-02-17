declare module 'comlink-loader!*' {
  class WebpackWorker extends Worker {
    constructor() {}

    // Add any custom functions to this class.
    // Make note that the return type needs to be wrapped in a promise.
    mine_WORKER(block: any): Promise<any>

    cancel_mining(): Promise<any>

    status(): Promise<'alive' | 'stopped'>
  }

  export = WebpackWorker
}
