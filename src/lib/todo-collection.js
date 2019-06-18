'use strict'
// const path = require('path')
const nanobus = require('nanobus')
const dragula = require('dragula')
const { TodoItem } = require('./todo-item.js')
const { TodoStore } = require('./todo-store.js')

window.bus = nanobus()
window.items = new TodoStore({ name: 'default' })

exports.TodoCollection = class TodoCollection {
  constructor (opts = {}) {
    opts.list = opts.list || '.todo-list'
    opts.name = opts.name || 'todo'
    this.container = document.querySelector(opts.list)
    window.items.toArray().forEach(todoItem => this.container.appendChild(todoItem.element))
    // if (fs.existsSync(this.file) && fs.statSync(this.file).isFile() && path.extname(this.file) === '.json') {
    //   // read saved todos
    //   const todos = JSON.parse(fs.readFileSync(this.file, 'utf8'))
    //   if (Array.isArray(todos)) {
    //     let position = 0
    //     for (let todo of todos) {
    //       let todoItem = new TodoItem(todo)
    //       todoItem.position = position
    //       window.items.set(todoItem.id, todoItem)
    //       this.container.appendChild(todoItem.element)
    //       position++
    //     }
    //   }
    // } else {
    //   // save initial todos
    //   fs.writeFileSync(this.file, '[]')
    // }

    // window.bus.on('updateTodos', () => {
    //   this.updateTodos()
    // })

    // window.bus.on('removeTodo', id => {
    //   this.remove(id)
    // })

    // dragable todos
    const drake = dragula([this.container], { removeOnSpill: true })
    drake.on('drop', (el, target, source, sibling) => {
      let items = []
      window.items.forEach(todoItem => {
        todoItem.position = Array.from(this.container.children).indexOf(todoItem.element)
        items.push(todoItem)
      })
      for (let item of items) {
        window.items.set(item.id, item)
      }
      // this.updateTodos()
    })

    drake.on('remove', (el, container, source) => {
      const id = el.id.split('-').pop()
      this.remove(id, false)
    })
  }

  showDone () {
    window.items.forEach(todoItem => {
      todoItem.update({ visible: todoItem.done })
    })
  }

  showAll () {
    window.items.forEach(todoItem => {
      todoItem.update({ visible: true })
    })
  }

  showPending () {
    window.items.forEach(todoItem => {
      todoItem.update({ visible: !todoItem.done })
    })
  }

  add (todo) {
    let todoItem = new TodoItem(todo)
    todoItem.position = window.items.size
    window.items.set(todoItem.id, todoItem)
    this.container.appendChild(todoItem.element)
    // this.updateTodos()
  }

  remove (id, shouldRemoveDOM = true) {
    if (shouldRemoveDOM) document.getElementById(`todo-${id}`).remove()
    window.items.delete(id)
    // this.updateTodos()
  }

  // updateTodos () {
  //   let todos = []
  //   window.items.forEach(todo => {
  //     todos.push(todo)
  //   })
  //   todos.sort((a, b) => {
  //     return a.position - b.position
  //   })
  //   fs.writeFileSync(this.file, JSON.stringify(todos.map(todo => todo.data), null, 2))
  // }
}
