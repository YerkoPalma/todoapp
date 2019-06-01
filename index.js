const { menubar } = require('menubar')

const mb = menubar({
  browserWindow: {
    resizable: false
  }
})

mb.on('ready', () => {
  console.log('Menubar app is ready.')
})
