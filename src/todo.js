exports = {
  addTodoItem,
  showTodo,
  hideTodo,
  toggleList
}

function toggleList (e) {
  // remove current active class
  document.querySelector('.todo-panels > .active').classList.remove('active')
  // add active class
  e.target.classList.add('active')
  // remove hidden classes
  return document.querySelector('.todo-list.active')
}

function showTodo (todoItem) {
  todoItem.classList.remove('hidden')
  todoItem.classList.add('shown')
}

function hideTodo (todoItem) {
  todoItem.classList.add('hidden')
  todoItem.classList.remove('shown')
}
function addTodoItem (todoName) {
  // add ui
  const todoItem = document.createElement('li')
  todoItem.classList.add('todo-item')

  const liNumber = document.querySelectorAll('li').length
  todoItem.innerHTML = `<input id="todo-${liNumber}" type="checkbox" />
  <label for="todo-${liNumber}"></label>
  <span>${todoName}</span>
  <form>
    <input type="text" value="${todoName}"/>
  </form>
  <a href="#" class="cta edit">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  </a>
  <a href="#" class="cta remove">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  </a>`

  todoItem.querySelector('.cta.edit').addEventListener('click', e => {
    todoItem.querySelector('span').style.display = 'none'
    todoItem.querySelector('form').style.display = 'block'
    todoItem.querySelector('form').addEventListener('submit', e => {
      e.preventDefault()
      todoItem.querySelector('span').textContent = todoItem.querySelector('input[type="text"]').value
      todoItem.querySelector('span').style.display = 'block'
      todoItem.querySelector('form').style.display = 'none'
    })
    todoItem.querySelector('input[type="text"]').focus()
  })
  todoItem.querySelector('.cta.remove').addEventListener('click', e => {
    e.preventDefault()
    if (window.confirm('Are you sure?')) todoItem.remove()
  })
  return todoItem
}
