const Store = require('electron-store')

exports.TodoStore = class TodoStore extends Store {
  forEach (handler) {
    if (typeof handler === 'function') {
      for (let [ key, value ] of this) {
        handler(value, key)
      }
    }
  }

  set (key, value) {
    if (value.data) {
      super.set(key, value.dat)
    } else {
      super.set(key, value)
    }
  }
}
