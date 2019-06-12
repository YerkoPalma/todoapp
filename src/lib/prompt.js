const html = require('nanohtml')

exports.prompt = function (text, cb) {
  // prompt template
  const promptElement = html`
  <div class="prompt-container">
    <div class="prompt">
      <span>${text}</span>
      <div class="promt-buttons">
        <button onclick=${e => dismiss(true)} class="ok">Ok</button>
        <button onclick=${e => dismiss(false)} class="cancel">Cancel</button>
      </div>
    </div>
  </div>`

  // append elements
  document.body.classList.add('prompted')
  document.body.appendChild(promptElement)

  // prepare listeners
  promptElement.addEventListener('animationend', e => {
    if (e.animationName === 'fadeout') {
      promptElement.remove()
    }
  })
  // run animations
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      promptElement.classList.add('show')
    })
  }, 0)

  function dismiss (ok) {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        promptElement.classList.add('hide')
        // should remove after dismissing
        cb(ok)
      })
    }, 0)
  }
}
