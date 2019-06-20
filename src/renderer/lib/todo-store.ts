import Store = require('electron-store')
import { TodoItemData, TodoItem } from './todo-item'

export class TodoStore extends Store<TodoItemData> {
  _items: {[key: string]: TodoItem};

  constructor (opts: Store.Options<TodoItemData>) {
    super(opts)
    this._items = Object.create(null)
    for (let [ key, value ] of this) {
      this._items[key] = new TodoItem(value)
    }
  }

  forEach (handler: Function): void {
    if (typeof handler === 'function') {
      for (let [ key, value ] of this) {
        handler(this.get(key, null), key)
      }
    }
  }

  set (...args: any[]): void {
    if (typeof args[0] === 'string' && args[1] instanceof TodoItem) {
      this._items[args[0]] = args[1]
      super.set(args[0], args[1].data)
    } else {
      super.set(args[0], args[1])
    }
  }

  get (key: any, defaultValue: any): TodoItem {
    return this._items[key]
  }

  delete (key: string): void {
    super.delete(key)
    delete this._items[key]
  }

  toArray (): Array<TodoItem> {
    return Object.keys(this.store).map(key => this.get(key, null)).sort((a, b) => a.position - b.position)
  }
}
