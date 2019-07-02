const { TodoCollection } = require('./lib/todo-collection')
const { inputPrompt } = require('./lib/prompt')
const html = require('nanohtml')

;(() => {
  let todoCollection = new TodoCollection()

  document.querySelector('form').addEventListener('submit', addTodo)
  document.querySelector('.todo-selector').addEventListener('click', selectTodo)

  // list rendering
  for (let list in window.lists.store) {
    // if the container doesn't exists
    if (!document.getElementById(list)) {
      const listContainer = html`<div class="todo-container ${window.lists.get(list).active ? 'active' : ''}" id="${list}">
          <a onclick=${selectTodo} class="todo-selector"></a>
          <h1 class="todo-list-title" data-title="${list}">${list}</h1>
          <form onsubmit=${addTodo}>
            <input class="todo-name" type="text"/>
            <button class="new-todo">+</button>
          </form>
          <ul class="todo-list ${window.lists.get(list).active ? 'active' : ''}">
          </ul>
          <div class="todo-panels">
            <a href="#" id="all-todos" class="active">All</a>
            <a href="#" id="pending-todos">Pending</a>
            <a href="#" id="done-todos">Done</a>
          </div>
        </div>`
      document.body.appendChild(listContainer)
    }
  }

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
        if (!document.querySelector(`#${listName}`)) {
          // we must create the container
          const listContainer = html`<div class="todo-container active" id="${listName}">
          <a onclick=${selectTodo} class="todo-selector"></a>
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

  function selectTodo (e: MouseEvent) {
    e.preventDefault()
    const selectedContainer = (e.target as Node).parentNode
    // deselect all containers
    document.querySelector('.todo-container.active').classList.remove('active')
    document.querySelector('.todo-list.active').classList.remove('active')

    // select current
    ;(selectedContainer as Element).classList.add('active')
    ;(selectedContainer as Element).querySelector('.todo-list').classList.add('active')

    // change avatar view
    Array.from(document.querySelectorAll('.todo-container.avatar')).forEach(container => {
      container.classList.remove('avatar')
    })

    // update title
    const newListTitle = (selectedContainer.querySelector('.todo-list-title') as HTMLElement).dataset.title
    document.querySelector('.current-list').textContent = newListTitle
    todoCollection = new TodoCollection({ name: newListTitle })
  }
})()
