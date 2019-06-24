import * as tape from 'tape'
import * as setup from './setup'

tape('launch App', async (t) => {
  // t.timeoutAfter(10e3)
  const app = setup.createApp()
  let error: any
  try {
    await setup.waitForLoad(app, t)
  } catch (err) {
    error = err
  } finally {
    setup.endTest(app, t, error)
  }
})
