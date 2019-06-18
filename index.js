'use strict'
const { menubar } = require('menubar')
const path = require('path')
const unhandled = require('electron-unhandled')
const debug = require('electron-debug')
const { is } = require('electron-util')
const { app, Tray } = require('electron')
const menu = require('./menu.js')

unhandled()
debug()

let mb
app.on('ready', () => {
  const tray = new Tray(path.join(__dirname, 'assets', 'icon.png'))
  tray.setContextMenu(menu)

  mb = menubar({
    browserWindow: {
      resizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    },
    tooltip: 'Simple todo manager',
    tray,
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
})
