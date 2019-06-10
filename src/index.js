const { TodoCollection } = require('./todoCollection.js')

;(() => {
  const todoCollection = new TodoCollection()

  const form = document.querySelector('form')
  form.addEventListener('submit', e => {
    e.preventDefault()
    const todoName = document.querySelector('.todo-name').value
    document.querySelector('.todo-name').value = ''
    todoCollection.add(todoName)
  })

  // panel switching
  document.querySelector('#all-todos').addEventListener('click', e => {
    e.preventDefault()
    toggleList(e)
    todoCollection.showAll()
  })

  document.querySelector('#pending-todos').addEventListener('click', e => {
    e.preventDefault()
    toggleList(e)
    todoCollection.showPending()
  })

  document.querySelector('#done-todos').addEventListener('click', e => {
    e.preventDefault()
    toggleList(e)
    todoCollection.showDone()
  })

  function toggleList (e) {
    // remove current active class
    document.querySelector('.todo-panels > .active').classList.remove('active')
    // add active class
    e.target.classList.add('active')
    // remove hidden classes
    return document.querySelector('.todo-list.active')
  }
})()
