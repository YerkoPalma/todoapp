'use strict'
const fs = require('fs')
const path = require('path')
const html = require('nanohtml')
const morph = require('nanomorph')
const nanologger = require('nanologger')
const nanobus = require('nanobus')
const dragula = require('dragula')
const isDev = require('electron-is-dev')
const { prompt } = require('./lib/prompt.js')

// in production, only log errors
if (!isDev) window.localStorage.setItem('logLevel', 'error')
const log = nanologger('TodoApp')
const bus = nanobus()

exports.TodoCollection = class TodoCollection {
  constructor (opts = {}) {
    this.file = opts.file || 'todos.json'
    opts.list = opts.list || '.todo-list'
    this.items = new Map()
    this.container = document.querySelector(opts.list)
    if (fs.existsSync(this.file) && fs.statSync(this.file).isFile() && path.extname(this.file) === '.json') {
      // read saved todos
      log.info(`Found ${this.file}`)
      const todos = JSON.parse(fs.readFileSync(this.file, 'utf8'))
      if (Array.isArray(todos)) {
        log.info(`Reading ${todos.length} todos`)
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
      log.info('No file found, creating an empty one')
    }

    bus.on('updateTodos', () => {
      this.updateTodos()
    })

    bus.on('removeTodo', id => {
      this.remove(id)
    })

    // dragable todos
    const drake = dragula([this.container], { removeOnSpill: true })
    drake.on('drop', (el, target, source, sibling) => {
      log.info('Reordering todos')
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
      log.info('Removing by dropping')
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
    log.info('Adding', todo)
    let todoItem = new TodoItem(todo)
    todoItem.position = this.items.size
    this.items.set(todoItem.id, todoItem)
    this.container.appendChild(todoItem.element)
    this.updateTodos()
  }

  remove (id, shouldRemoveDOM = true) {
    log.info('Removing', id)
    if (shouldRemoveDOM) document.getElementById(`todo-${id}`).remove()
    this.items.delete(id)
    this.updateTodos()
  }

  updateTodos () {
    log.info('Updating todos')
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

class TodoItem {
  constructor (args) {
    if (typeof args === 'string') {
      this.text = args
      this.done = false
      this.id = Math.random().toString(36).slice(2)
    } else {
      this.text = args.text
      this.done = args.done || false
      this.id = args.id || Math.random().toString(36).slice(2)
    }
    this.position = 0
    this.visible = true
    this.editable = false
    this.element = this.getTemplate()
  }

  getTemplate () {
    return html`
    <li class="todo-item ${this.visible ? 'shown' : 'hidden'}" id="todo-${this.id}">
      <input id="inputtodo-${this.id}" type="checkbox" onchange=${this.toggleDone.bind(this)} ${this.done ? 'checked' : ''}/>
      <label for="inputtodo-${this.id}"></label>
      <span style="display: ${!this.editable ? 'block' : 'none'}">${this.text}</span>
      <form onsubmit=${this.setText.bind(this)} style="display: ${this.editable ? 'block' : 'none'}">
        <input type="text" value="${this.text}"/>
      </form>
      <a href="#" class="cta edit" onclick=${this.toggleEdit.bind(this)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </a>
      <a href="#" class="cta remove" onclick=${e => prompt('Are you sure?', this.removeHandler.bind(this))}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </a>
    </li>`
  }

  removeHandler (shouldRemove) {
    if (shouldRemove) {
      // remove!
      log.info('Removing todo', this.id)
      bus.emit('removeTodo', this.id)
    }
  }

  toggleEdit (e) {
    e.preventDefault()
    this.update({ editable: !this.editable })
  }

  toggleDone (e) {
    e.preventDefault()
    this.update({ done: !this.done })
  }

  setText (e) {
    e.preventDefault()
    this.update({ editable: !this.editable, text: document.querySelector(`#todo-${this.id} input[type="text"]`).value })
  }

  get data () {
    return {
      id: this.id,
      text: this.text,
      done: this.done
    }
  }

  update (values) {
    let changed = false
    let shouldUpdate = false
    log.info('Updating with values', values)
    if (typeof values === 'object' && typeof values.text === 'string') {
      this.text = values.text
      changed = true
      shouldUpdate = true
    }
    if (typeof values === 'object' && typeof values.done === 'boolean') {
      this.done = values.done
      changed = true
      shouldUpdate = true
    }
    if (typeof values === 'object' && typeof values.editable === 'boolean') {
      this.editable = values.editable
      changed = true
    }

    if (typeof values === 'object' && typeof values.visible === 'boolean') {
      this.visible = values.visible
      changed = true
    }

    if (shouldUpdate) bus.emit('updateTodos')
    if (changed) this.render()
    return this
  }

  render () {
    this.element = morph(this.element, this.getTemplate())
  }
}
