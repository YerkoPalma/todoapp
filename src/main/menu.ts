import * as path from 'path'
import { app, Menu, shell } from 'electron'
import {
  is,
  aboutMenuItem,
  openUrlMenuItem,
  openNewGitHubIssue,
  debugInfo
} from 'electron-util'
import config from './config'

const helpSubmenu = [
  openUrlMenuItem({
    label: 'Website',
    url: 'https://github.com/YerkoPalma/todoapp'
  }),
  openUrlMenuItem({
    label: 'Source Code',
    url: 'https://github.com/YerkoPalma/todoapp'
  }),
  {
    label: 'Report an Issue…',
    click () {
      const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->
---
${debugInfo()}`

      openNewGitHubIssue({
        user: 'YerkoPalma',
        repo: 'todoapp',
        body
      })
    }
  }
]

if (!is.macos) {
  helpSubmenu.push(
    {
      type: 'separator'
    },
    aboutMenuItem({
      icon: path.join(__dirname, '..', '..', 'assets', 'icon.png'),
      text: 'Created by Your Yerko Palma'
    })
  )
}

const debugSubmenu: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'Show Settings',
    click () {
      config.openInEditor()
    }
  },
  {
    label: 'Show App Data',
    click () {
      shell.openItem(app.getPath('userData'))
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Delete Settings',
    click () {
      config.clear()
      app.relaunch()
      app.quit()
    }
  },
  {
    label: 'Delete App Data',
    click () {
      shell.moveItemToTrash(app.getPath('userData'))
      app.relaunch()
      app.quit()
    }
  }
]

// Linux and Windows
const template = helpSubmenu

if (is.development) {
  template.push({
    label: 'Debug',
    submenu: debugSubmenu
  })
}

export default Menu.buildFromTemplate(template)
