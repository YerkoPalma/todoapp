const { TodoCollection } = require('./lib/todo-collection')
const { inputPrompt } = require('./lib/prompt')
const html = require('nanohtml')

;(() => {
  let todoCollection = new TodoCollection()

  document.querySelector('form').addEventListener('submit', addTodo)

  // list switching
  document.querySelector('.switch-list').addEventListener('click', (e: MouseEvent) => {
    e.preventDefault()
    const containers = Array.from(document.querySelectorAll('.todo-container'))
    for (let container of containers) {
      container.classList.toggle('avatar')
    }
  })

  // list creation
  document.querySelector('.add-list').addEventListener('click', (e: MouseEvent) => {
    e.preventDefault()
    inputPrompt('Pick a name for your new list', (listName: string | null) => {
      if (listName !== null) {
        // change control bar title
        document.querySelector('.current-list').textContent = listName
        // deselect current active list
        document.querySelector('.todo-list.active').classList.remove('active')
        document.querySelector('.todo-container.active').classList.remove('active')
        // check if the list already exists
        let listContainer = document.querySelector(`#${listName}`)
        if (listContainer) {
          // the container already exists
        } else {
          // we must create the container
          listContainer = html`<div class="todo-container active" id="${listName}">
          <h1 class="todo-list-title" data-title="${listName}">${listName}</h1>
          <form onsubmit=${addTodo}>
            <input class="todo-name" type="text"/>
            <button class="new-todo">+</button>
          </form>
          <ul class="todo-list active">
          </ul>
          <div class="todo-panels">
            <a href="#" id="all-todos" class="active">All</a>
            <a href="#" id="pending-todos">Pending</a>
            <a href="#" id="done-todos">Done</a>
          </div>
        </div>`
          document.body.appendChild(listContainer)
        }
        todoCollection = new TodoCollection({ name: listName })
      }
    })
  })

  // panel switching
  document.querySelector('#all-todos').addEventListener('click', (e: MouseEvent) => {
    e.preventDefault()
    toggleList(e)
    todoCollection.showAll()
  })

  document.querySelector('#pending-todos').addEventListener('click', (e: MouseEvent) => {
    e.preventDefault()
    toggleList(e)
    todoCollection.showPending()
  })

  document.querySelector('#done-todos').addEventListener('click', (e: MouseEvent) => {
    e.preventDefault()
    toggleList(e)
    todoCollection.showDone()
  })

  function toggleList (e: MouseEvent) {
    // remove current active class
    document.querySelector('.todo-panels > .active').classList.remove('active');
    // add active class
    (e.target as HTMLElement).classList.add('active')
    // remove hidden classes
    return document.querySelector('.todo-list.active')
  }

  function addTodo (e: MouseEvent) {
    e.preventDefault()
    const todoName = (document.querySelector('.todo-container.active .todo-name') as HTMLInputElement).value;
    (document.querySelector('.todo-container.active .todo-name') as HTMLInputElement).value = ''
    todoCollection.add(todoName)
  }
})()
