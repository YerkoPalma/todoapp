'use strict'
const dragula = require('dragula')
const { TodoItem } = require('./todo-item.js')
const { TodoStore } = require('./todo-store.js')

window.items = new TodoStore({ name: 'default' })

exports.TodoCollection = class TodoCollection {
  constructor (opts = {}) {
    opts.list = opts.list || '.todo-list'
    opts.name = opts.name || 'todo'
    this.container = document.querySelector(opts.list)
    window.items.toArray().forEach(todoItem => this.container.appendChild(todoItem.element))

    // dragable todos
    const drake = dragula([this.container], { removeOnSpill: true })
    drake.on('drop', (el, target, source, sibling) => {
      window.items.toArray().forEach(todoItem => {
        todoItem.position = Array.from(this.container.children).indexOf(todoItem.element)
        window.items.set(todoItem.id, todoItem)
      })
    })

    drake.on('remove', (el, container, source) => {
      const id = el.id.split('-').pop()
      this.remove(id, false)
    })
  }

  showDone () {
    window.items.toArray().forEach(todoItem => {
      todoItem.update({ visible: todoItem.done })
    })
  }

  showAll () {
    window.items.toArray().forEach(todoItem => {
      todoItem.update({ visible: true })
    })
  }

  showPending () {
    window.items.toArray().forEach(todoItem => {
      todoItem.update({ visible: !todoItem.done })
    })
  }

  add (todo) {
    let todoItem = new TodoItem(todo)
    todoItem.position = window.items.size
    window.items.set(todoItem.id, todoItem)
    this.container.appendChild(todoItem.element)
  }

  remove (id, shouldRemoveDOM = true) {
    if (shouldRemoveDOM) document.getElementById(`todo-${id}`).remove()
    window.items.delete(id)
  }
}
