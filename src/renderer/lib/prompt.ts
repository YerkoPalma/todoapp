import html = require('nanohtml')

export function prompt(text: string, cb: Function) {
  // prompt template
  const promptElement = html.default`
  <div class="prompt-container">
    <div class="prompt">
      <span>${text}</span>
      <div class="promt-buttons">
        <button onclick=${(e: EventTarget) => dismiss(true)} class="ok">Ok</button>
        <button onclick=${(e: EventTarget) => dismiss(false)} class="cancel">Cancel</button>
      </div>
    </div>
  </div>`

  // append elements
  document.body.classList.add('prompted')
  document.body.appendChild(promptElement)

  // prepare listeners
  promptElement.addEventListener('animationend', (e: AnimationEvent) => {
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

  function dismiss (ok: boolean) {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        promptElement.classList.add('hide')
        // should remove after dismissing
        cb(ok)
      })
    }, 0)
  }
}
