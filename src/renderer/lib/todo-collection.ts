import * as dragula from 'dragula'
import { TodoItem, TodoItemOptions } from './todo-item'
import { TodoStore } from './todo-store'
import Store = require('electron-store')

interface TodoCollectionOptions {
  list?: string;
  name?: string;
}

export class TodoCollection {
  container: HTMLElement;

  constructor (opts: TodoCollectionOptions | undefined = {}) {
    opts.list = opts.list || '.todo-list.active'
    opts.name = opts.name || 'default'
    window.items = new TodoStore({ name: opts.name })
    if (!window.lists) {
      window.lists = new Store({ name: 'todo-lists' })
    }
    // change every list to unactive
    const currentLists = window.lists.store
    for (let list in currentLists) {
      currentLists[list] = { active: false }
    }
    window.lists.set(currentLists)
    window.lists.set(opts.name, { active: true })
    this.container = document.querySelector(opts.list)
    if (this.container.children.length === 0) window.items.toArray().forEach(todoItem => this.container.appendChild(todoItem.element))

    // dragable todos
    const drake = dragula([this.container], { removeOnSpill: true })
    drake.on('drop', (el: any, target: any, source: any, sibling: any) => {
      window.items.toArray().forEach(todoItem => {
        todoItem.position = Array.from(this.container.children).indexOf(todoItem.element)
        window.items.set(todoItem.id, todoItem)
      })
    })

    drake.on('remove', (el: HTMLElement, container: any, source: any) => {
      const id = el.id.split('-').pop()
      this.remove(id, false)
    })
  }

  showDone (): void {
    window.items.toArray().forEach(todoItem => {
      todoItem.update({ visible: todoItem.done })
    })
  }

  showAll (): void {
    window.items.toArray().forEach(todoItem => {
      todoItem.update({ visible: true })
    })
  }

  showPending (): void {
    window.items.toArray().forEach(todoItem => {
      todoItem.update({ visible: !todoItem.done })
    })
  }

  add (todo: string | TodoItemOptions): void {
    let todoItem = new TodoItem(todo)
    todoItem.position = window.items.size
    window.items.set(todoItem.id, todoItem)
    this.container.appendChild(todoItem.element)
  }

  remove (id: string, shouldRemoveDOM: boolean = true): void {
    if (shouldRemoveDOM) document.getElementById(`todo-${id}`).remove()
    window.items.delete(id)
  }
}
