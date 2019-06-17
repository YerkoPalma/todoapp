const { menubar } = require('menubar')
const path = require('path')
const unhandled = require('electron-unhandled')
const debug = require('electron-debug')
const { is } = require('electron-util')

unhandled()
debug()

const mb = menubar({
  browserWindow: {
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  },
  tooltip: 'Simple todo manager',
  icon: path.join(__dirname, 'assets', 'icon.png'),
  index: path.join(__dirname, 'src', 'index.html'),
  preloadWindow: true
})

mb.app.setAppUserModelId('com.yerkopalma.Todoapp')

if (!mb.app.requestSingleInstanceLock()) {
  mb.app.quit()
}

mb.app.on('window-all-closed', () => {
  if (!is.macos) {
    mb.app.quit()
  }
})

mb.on('after-create-window', () => {
  console.log('process version', process.version)
  console.log('v8', process.versions.v8)
  console.log('node', process.versions.node)
  console.log('electron', process.versions.electron)
})
