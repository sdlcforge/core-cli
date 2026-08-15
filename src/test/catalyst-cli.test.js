/* global afterAll beforeAll describe test */
import { startCoreCLI } from '../core-cli'

describe('startCoreCLI', () => {
  let origArgv

  beforeAll(() => { origArgv = process.argv })
  afterAll(() => { process.argv = origArgv })

  test('can start the CLI process (defines necessary parameters)', async() => {
    process.argv = ['node', 'foo.js', '--version']

    await startCoreCLI() // expect to not throw
  })
})
