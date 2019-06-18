const Store = require('electron-store')
const { TodoItem } = require('./todo-item.js')

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
      super.set(key, value.data)
    } else {
      super.set(key, value)
    }
  }

  get (key, defaultValue) {
    return new TodoItem(super.get(key))
  }

  toArray () {
    return Object.keys(this.store).map(key => this.get(key)).sort((a, b) => a.position - b.position)
  }
}
