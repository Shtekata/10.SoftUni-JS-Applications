export default class Provider {
  constructor(data) {
    this.subscribers = [];
    this.data = data || null;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;

    for (let subscriber of this.subscribers) {
      subscriber(data);
    }
  }

  subscribe(handler) {
    this.subscribers.push(handler);
  }

  unsubscribe(handler) {
    for (let i = 0; i < this.subscribers.length; i++) {
      if (this.subscribers[i] === handler) {
        this.subscribers.splice(i, 1);
        return;
      }
    }
  }
}
