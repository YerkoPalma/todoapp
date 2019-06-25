import { menubar, Menubar } from 'menubar'
import * as path from 'path'
import unhandled = require('electron-unhandled')
import debug = require('electron-debug')
import { is } from 'electron-util'
import { app, Tray } from 'electron'
import menu from './menu.js'

if (is.development) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron')
  })
}

unhandled()
debug({
  showDevTools: false
})

let mb: Menubar
app.on('ready', () => {
  const tray = new Tray(path.join(__dirname, '..', '..', 'assets', 'icon.png'))
  tray.setContextMenu(menu)

  mb = menubar({
    browserWindow: {
      resizable: false,
      webPreferences: {
        nodeIntegration: true
      },
      alwaysOnTop: is.development
    },
    tooltip: 'Simple todo manager',
    tray,
    index: path.join(__dirname, '..', 'renderer', 'index.html'),
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
    console.log('\napp data', mb.app.getPath('userData'))
    console.log('v8', process.versions.v8)
    console.log('node', process.versions.node)
    console.log('electron', process.versions.electron)
  })
})
