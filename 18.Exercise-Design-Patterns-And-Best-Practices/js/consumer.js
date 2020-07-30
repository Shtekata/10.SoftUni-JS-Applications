export default class Consumer {
  constructor(provider) {
    provider.subscribe(this.onData.bind(this));
  }

  onData(data) {}
}
