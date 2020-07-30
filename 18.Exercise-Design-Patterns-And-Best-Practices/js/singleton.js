// export data = {};
let data = {};

export default class Singleton {
  static get data() {
    // return Singleton.data;
    return data;
  }

  static set data(value) {
    // Singleton.data = value;
    data = value;
  }
}
