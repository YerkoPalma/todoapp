const { TodoCollection } = require('./lib/todo-collection.js')

;(() => {
  const todoCollection = new TodoCollection()

  const form = document.querySelector('form')
  form.addEventListener('submit', e => {
    e.preventDefault()
    const todoName = (document.querySelector('.todo-name') as HTMLInputElement).value;
    (document.querySelector('.todo-name') as HTMLInputElement).value = ''
    todoCollection.add(todoName)
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
})()
