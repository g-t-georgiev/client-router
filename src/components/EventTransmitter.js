class EventTransmitter {

    static instance = null;

    constructor() {

        if (EventTransmitter.instance)
            return EventTransmitter.instance;

        EventTransmitter.instance = this;
    }

    dispatch(type, detail) {

        // console.log('EventTransmitter#dispatch', type, detail);
        return document.dispatchEvent(new CustomEvent(type,  { bubbles: true, cancelable: true, detail }));
    }

    subscribe(type, handler) {

        // console.log('EventTransmitter#subscribe', type, handler);
        document.addEventListener(type, handler);
        return this.unsubscribe.bind(this, type, handler);
    }

    unsubscribe(type, handler) {

        document.removeEventListener(type, handler);
    }

    static createInstance() {

        if (!this.instance) 
            return new this();
        
        return this.instance;
    }
}

export const eventTransmitter = EventTransmitter.createInstance();

export default eventTransmitter;