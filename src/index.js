const { addTodoItem, showTodo, hideTodo, toggleList } = require('./todo.js')

;(() => {
  const form = document.querySelector('form')
  form.addEventListener('submit', e => {
    e.preventDefault()
    // get todo name
    const todoName = document.querySelector('.todo-name').value
    document.querySelector('.todo-name').value = ''
    const todoItem = addTodoItem(todoName)
    document.querySelector('.todo-list').appendChild(todoItem)
  })

  // panel switching
  document.querySelector('#all-todos').addEventListener('click', e => {
    e.preventDefault()
    const todosList = toggleList(e)
    for (let todoItem of todosList.children) {
      showTodo(todoItem)
    }
  })

  document.querySelector('#pending-todos').addEventListener('click', e => {
    e.preventDefault()
    const todosList = toggleList(e)
    for (let todoItem of todosList.children) {
      // if input is checked, todo is done
      if (todoItem.querySelector('input:checked')) {
        // must hide todo
        hideTodo(todoItem)
      } else {
        showTodo(todoItem)
      }
    }
  })

  document.querySelector('#done-todos').addEventListener('click', e => {
    e.preventDefault()
    const todosList = toggleList(e)
    for (let todoItem of todosList.children) {
      // if input is checked, todo is done
      if (!todoItem.querySelector('input:checked')) {
        // must show todo
        hideTodo(todoItem)
      } else {
        showTodo(todoItem)
      }
    }
  })
})()
