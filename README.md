# sdlcforge cli

**Note:** This CLI is being consolidated into a single self-contained binary as part of an in-progress SDLCForge modernization. See the project's `plan/` directory for details on this migration effort.

Command line interface for SDLCPilot, a Software Development Life Cycle management tool. Currently support GitHub node projects.

- [Install](#install)
- [Usage](#usage)

## Install

1. If either `npm -v` or `node -v` are not found, see ['Install `node` and `npm`'](#install-node-and-npm).
2. Install 'sdlcpilot-cli' and '@sdlcforge/core-server':
   ```bash
   npm i -g sdlcpilot-cli @sdlcforge/core-server
   ```
3. Run:
   ```bash
   sdlc --setup
   ```
4. Open a new terminal window to pickup the SDLCPilot tab completion support, or type 'source .bashrc' or 'source .zshrc' on from your bash or zsh terminal respectively.
5. Install the base SDLC plugins:
   ```bash
   sdlc server plugins bundles add -- bundles=sdlcpilot-github-node
   ```

### Troubleshooting the install

#### sdlc not found

check where your global NPM packages are installed with:
```bash
npm ls -g
```

The first line should tell you where the NPM `lib` direcotry is located. Verify that if you swap that out `lib` for `bin`, you can `ls` the `sdlc` executable. It might be something like: `/opt/homebrew/bin` or `/Users/foo/.npm-global/bin`. Now [update your `PATH`](#update-your-path) to include the global NPM bin directory.

#### Install `node` and `npm`

We recommend using Node Version Manager (`nvm`) to install `node` and `npm`; [`nvm` installation instructions can be found here](https://github.com/nvm-sh/nvm). `nvm` provides support for installing 'global' packages on a per-user account basis without the need for root priveleges. It also provides a convenient tool for using and testing different versions of node.

To use the latest "long term support" version (LTS), use:
```bash
nvm install --lts
nvm use --lts
```

Or to use the latest stable version, use:
```bash
nvm install node
nvm use node
```

## Usage

1. Create a project:
   ```
   sdlc projects create -- newProjectName=liquid-labs/indepndent-context
   ```
   This will both create a (initially private) repo and check it out in your playground base, which is `${HOME}/playground`. (This is not currently configurable.)
   -- or --
   You can `git clone` a project under `~/playground`. The standard expected layout is `~/playground/<git org>/<repo name>`. (In future, `sdlc` will support importing projects directly.)
3. Change dir to the new project: `cd independent-context`
4. Open an "Initial implementation" issue and start the work. After this, you should be on the workbranch.
   1. Create the issue in GitHub if you want to be verbose. Then start the work:
      ```
      sdlc work start -- issues=1
      ```
   2. Directly from the command line:
      ```
      sdlc work start -- issueTitle='Initial implementation' issueOverview='Implement basic functions' issueDeliverables="do X;;do Y"
      ```
5. Create a minimal project:
   ```
   mkdir src
   echo -e "console.log('Hello world!')\n" > src/index.mjs
   ```
6. Setup development cycle stuff (if creating a Javascript based project):
   1. `sdlc projects workflows local node-build add`
   2. Update the `package.json` scripts:
      ```
      "scripts": {
          "build": "make build",
          "test": "make test",
          "preversion": "make qa",
          "lint": "make lint",
          "lint:fix": "make lint-fix",
          "qa": "make qa"
        }
      ```
7. Do some work and save it: `sdlc work save -- summary="initial implementation"`
8. Create PR: `sdlc work submit`
9. Review and merge PR on GitHub.
10. Close the work and return to main: `sdlc work close`

Refer to the [user documentation](./docs/index.md)
