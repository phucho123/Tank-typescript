export class Observable {
    static instance: Observable | null = null
    private observers: any

    constructor() {
        this.observers = []
    }

    static getInstance() {
        if (!Observable.instance) Observable.instance = new Observable()
        return Observable.instance
    }

    public subscribe(gameObj: any) {
        this.observers.push(gameObj)
    }

    public unsubscribe(gameObj: any) {
        this.observers = this.observers.filter((observer: any) => observer !== gameObj)
    }

    public notify(message: string) {
        this.observers.forEach((observer: any) => observer.observerMessage(message))
    }
}
