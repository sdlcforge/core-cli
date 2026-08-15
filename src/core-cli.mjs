import { readFileSync } from 'node:fs'
import * as fsPath from 'node:path'

import { COMPLY_API_SPEC_PATH, COMPLY_HOME, COMPLY_PORT, COMPLY_SERVER_CLI_NAME } from '@liquid-labs/comply-defaults'
import { PLUGABLE_PLAYGROUND, PLUGABLE_REGISTRY } from '@liquid-labs/plugable-defaults'
import { startCLI } from '@liquid-labs/plugable-express-cli'

let versionCache

const getVersion = () => {
  if (versionCache === undefined) {
    // works for both prod and test
    const packagePath = fsPath.resolve(__dirname, '..', 'package.json')

    const pkgJSON = JSON.parse(readFileSync(packagePath, { encoding : 'utf8' }))
    const { version } = pkgJSON

    versionCache = version
  }

  return versionCache
}

const localServerDevPaths = [
  fsPath.join(PLUGABLE_PLAYGROUND(), COMPLY_SERVER_CLI_NAME()),
  fsPath.join(PLUGABLE_PLAYGROUND(), 'liquid-labs', COMPLY_SERVER_CLI_NAME())
]

const cliSettings = {
  cliName           : 'sdlc',
  getVersion,
  defaultRegistries : [PLUGABLE_REGISTRY()],
  localServerDevPaths,
  noRegistries      : false,
  port              : COMPLY_PORT(),
  serverAPIPath     : COMPLY_API_SPEC_PATH(),
  serverExec        : COMPLY_SERVER_CLI_NAME(),
  serverHome        : COMPLY_HOME(),
  serverPackage     : COMPLY_SERVER_CLI_NAME(),
  serverVersion     : 'latest'
}

const startCoreCLI = async() => await startCLI(cliSettings)

export { startCoreCLI }
