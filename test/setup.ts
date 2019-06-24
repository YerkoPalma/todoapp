import { Application } from 'spectron'
import { Test } from 'tape'
import * as path from 'path'

export function createApp (): Application {
  return new Application({
    path: path.join(__dirname, '..', 'node_modules', '.bin',
      'electron' + (process.platform === 'win32' ? '.cmd' : '')),
    args: [ path.join(__dirname, '..', 'build', 'main') ],
    env: { NODE_ENV: 'test' },
    waitTimeout: 10e3
  })
}

export async function waitForLoad (app: Application, t: Test): Promise<void> {
  try {
    await app.start()
    const title = await app.webContents.getTitle()
    // Note the window title is WebTorrent, this is the HTML <title>
    t.equal(title, 'Todo App', 'Html title')
  } catch (e) {
    t.error(e)
  }
}

export async function endTest (app: Application, t: Test, err?: any): Promise<void> {
  try {
    await app.stop()
  } catch(e) {
  } finally {
    t.end(err)
  }
}
