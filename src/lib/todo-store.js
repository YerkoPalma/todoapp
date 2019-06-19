const Store = require('electron-store')
const { TodoItem } = require('./todo-item.js')

exports.TodoStore = class TodoStore extends Store {
  constructor (opts) {
    super(opts)
    this._items = Object.create(null)
    for (let [ key, value ] of this) {
      this._items[key] = new TodoItem(value)
    }
  }
  forEach (handler) {
    if (typeof handler === 'function') {
      for (let [ key ] of this) {
        handler(this.get(key), key)
      }
    }
  }

  set (key, value) {
    this._items[key] = value
    if (value.data) {
      super.set(key, value.data)
    } else {
      super.set(key, value)
    }
  }

  get (key, defaultValue) {
    return this._items[key]
  }

  delete (key) {
    super.delete(key)
    delete this._items[key]
  }

  toArray () {
    return Object.keys(this.store).map(key => this.get(key)).sort((a, b) => a.position - b.position)
  }
}
