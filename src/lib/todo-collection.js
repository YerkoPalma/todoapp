'use strict'
const fs = require('fs')
const path = require('path')
const nanobus = require('nanobus')
const dragula = require('dragula')
const { TodoItem } = require('./todo-item.js')

window.bus = nanobus()

exports.TodoCollection = class TodoCollection {
  constructor (opts = {}) {
    this.file = opts.file || 'todos.json'
    opts.list = opts.list || '.todo-list'
    this.items = new Map()
    this.container = document.querySelector(opts.list)
    if (fs.existsSync(this.file) && fs.statSync(this.file).isFile() && path.extname(this.file) === '.json') {
      // read saved todos
      const todos = JSON.parse(fs.readFileSync(this.file, 'utf8'))
      if (Array.isArray(todos)) {
        let position = 0
        for (let todo of todos) {
          let todoItem = new TodoItem(todo)
          todoItem.position = position
          this.items.set(todoItem.id, todoItem)
          this.container.appendChild(todoItem.element)
          position++
        }
      }
    } else {
      // save initial todos
      fs.writeFileSync(this.file, '[]')
    }

    window.bus.on('updateTodos', () => {
      this.updateTodos()
    })

    window.bus.on('removeTodo', id => {
      this.remove(id)
    })

    // dragable todos
    const drake = dragula([this.container], { removeOnSpill: true })
    drake.on('drop', (el, target, source, sibling) => {
      let items = []
      this.items.forEach(todoItem => {
        todoItem.position = Array.from(this.container.children).indexOf(todoItem.element)
        items.push(todoItem)
      })
      for (let item of items) {
        this.items.set(item.id, item)
      }
      this.updateTodos()
    })

    drake.on('remove', (el, container, source) => {
      const id = el.id.split('-').pop()
      this.remove(id, false)
    })
  }

  showDone () {
    this.items.forEach(todoItem => {
      todoItem.update({ visible: todoItem.done })
    })
  }

  showAll () {
    this.items.forEach(todoItem => {
      todoItem.update({ visible: true })
    })
  }

  showPending () {
    this.items.forEach(todoItem => {
      todoItem.update({ visible: !todoItem.done })
    })
  }

  add (todo) {
    let todoItem = new TodoItem(todo)
    todoItem.position = this.items.size
    this.items.set(todoItem.id, todoItem)
    this.container.appendChild(todoItem.element)
    this.updateTodos()
  }

  remove (id, shouldRemoveDOM = true) {
    if (shouldRemoveDOM) document.getElementById(`todo-${id}`).remove()
    this.items.delete(id)
    this.updateTodos()
  }

  updateTodos () {
    let todos = []
    this.items.forEach(todo => {
      todos.push(todo)
    })
    todos.sort((a, b) => {
      return a.position - b.position
    })
    fs.writeFileSync(this.file, JSON.stringify(todos.map(todo => todo.data), null, 2))
  }
}
