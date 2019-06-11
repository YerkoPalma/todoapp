const { menubar } = require('menubar')
const path = require('path')

const mb = menubar({
  browserWindow: {
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  },
  icon: path.join(__dirname, 'assets', 'icon.png'),
  index: path.join(__dirname, 'src', 'index.html'),
  preloadWindow: true
})

mb.on('ready', () => {
  console.log('Menubar app is ready.')
})

mb.on('after-create-window', () => {
  console.log('window created.')
  mb.window.openDevTools()
})
