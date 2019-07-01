import html = require('nanohtml')

function _promp (text: string, type: string | Function, cb?: Function) {
  if (!cb && typeof type === 'function') {
    cb = type
    type = ''
  }
  // prompt template
  const promptElement = html.default`
  <div class="prompt-container">
    <div class="prompt">
    <span>${text}</span>
    ${type
      ? html.default`<input type="${type}" class="prompt-type"/>`
      : ''}
      <div class="promt-buttons">
        <button onclick=${(e: EventTarget) => dismiss(type ? (promptElement.querySelector('.prompt-type') as HTMLInputElement).value : true)} class="ok">Ok</button>
        <button onclick=${(e: EventTarget) => dismiss(type ? null : false)} class="cancel">Cancel</button>
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
  function dismiss (arg: string | boolean | null) {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        promptElement.classList.add('hide')
        // should remove after dismissing
        cb(arg)
      })
    }, 0)
  }
}

export function prompt(text: string, cb: Function) {
  _promp(text, cb)
}

export function inputPrompt(text: string, cb: Function) {
  _promp(text, 'text', cb)
}
