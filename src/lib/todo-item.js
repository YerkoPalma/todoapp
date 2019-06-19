const html = require('nanohtml')
const morph = require('nanomorph')
const { prompt } = require('./prompt.js')

exports.TodoItem = class TodoItem {
  constructor (args) {
    if (typeof args === 'string') {
      this.text = args
      this.done = false
      this.id = Math.random().toString(36).slice(2)
      this.position = 0
    } else {
      this.text = args.text
      this.done = args.done || false
      this.id = args.id || Math.random().toString(36).slice(2)
      this.position = args.position || 0
    }

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
      window.items.delete(this.id)
      this.element.remove()
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
      done: this.done,
      position: this.position
    }
  }

  update (values) {
    let changed = false
    if (typeof values === 'object' && typeof values.text === 'string') {
      this.text = values.text
      changed = true
      window.items.set(this.id, this)
    }
    if (typeof values === 'object' && typeof values.done === 'boolean') {
      this.done = values.done
      changed = true
      window.items.set(this.id, this)
    }
    if (typeof values === 'object' && typeof values.editable === 'boolean') {
      this.editable = values.editable
      changed = true
    }

    if (typeof values === 'object' && typeof values.visible === 'boolean') {
      this.visible = values.visible
      changed = true
    }

    if (changed) this.render()
    return this
  }

  render () {
    this.element = morph(this.element, this.getTemplate())
  }
}
