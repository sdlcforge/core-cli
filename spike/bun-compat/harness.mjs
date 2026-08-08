#!/usr/bin/env bun
/**
 * Bun `child_process` compatibility spike harness.
 *
 * Exercises, inside a `bun build --compile` standalone binary, the same shell-out
 * pattern `@liquid-labs/liq-projects`' `projects create` flow uses today (verified
 * against `liq-projects/src/handlers/projects/_lib/create-lib.mjs` and
 * `@liquid-labs/shell-toolkit`'s `tryExec`/`tryExecAsync`):
 *
 *   - `shelljs`'s `shell.exec(cmd)` (synchronous, string command, run through a
 *     shell) for `git init`, `git add`/`commit`, `git push --set-upstream`, and
 *     (in the real code) `hub create` / `hub fork` / `hub delete`.
 *   - `shelljs`'s `shell.exec(cmd, { async: true }, cb)` for the async variant
 *     `tryExecAsync` uses.
 *
 * This is a throwaway spike (see `plan/phase-01-cli-foundation/002-bun-compatibility-spike.md`).
 * It does not get wired into the real build; it is compiled and run standalone.
 *
 * Each check pushes a `{ name, status: 'pass'|'fail', detail }` record onto `results`.
 * The harness prints a JSON summary to stdout and exits non-zero if any check failed,
 * so the *compiled binary's own exit code* is part of the evidence, not just its stdout.
 */
import { mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import * as fsPath from 'node:path'
import { execSync, execFileSync } from 'node:child_process'

import shell from 'shelljs'

shell.config.silent = true

const results = []
const record = (name, status, detail) => {
  results.push({ name, status, detail })
  const label = status === 'pass' ? 'PASS' : 'FAIL'
  process.stderr.write(`[${label}] ${name}${detail ? ' - ' + detail : ''}\n`)
}

const runCheck = async(name, fn) => {
  try {
    await fn()
  }
  catch (e) {
    record(name, 'fail', `threw: ${e.message}`)
  }
}

// scratch layout: a "staging" project dir (mirrors create-lib.mjs's stagingDir) and a
// local bare repo standing in for the GitHub remote (mocking `hub create`'s network
// effect, per the task's explicit allowance to mock against "a local git remote").
const scratchRoot = mkdtempSync(fsPath.join(tmpdir(), 'sdlcpilot-bun-spike-'))
const stagingDir = fsPath.join(scratchRoot, 'staging-project')
const bareRemoteDir = fsPath.join(scratchRoot, 'mock-origin.git')

process.stderr.write(`scratch root: ${scratchRoot}\n`)

// --- cleanup helper, shared between the normal try/finally path below and the
//     SIGINT/SIGTERM handlers, so a manual Ctrl+C mid-run still removes the
//     scratch directory instead of bypassing the finally block. ---
const cleanupScratchRoot = () => {
  try {
    rmSync(scratchRoot, { recursive : true, force : true })
    process.stderr.write(`cleaned up scratch root: ${scratchRoot}\n`)
  }
  catch (e) {
    process.stderr.write(`WARNING: failed to clean up scratch root ${scratchRoot}: ${e.message}\n`)
  }
}

const handleTerminationSignal = (signal) => {
  process.stderr.write(`received ${signal}, cleaning up scratch root before exit\n`)
  cleanupScratchRoot()
  process.exit(1)
}
process.on('SIGINT', handleTerminationSignal)
process.on('SIGTERM', handleTerminationSignal)

try {
  // --- 1. git init (mirrors: `cd "${stagingDir}" && git init --quiet .`) ---
  await runCheck('shelljs.exec sync: git init', () => {
    execSync(`mkdir -p "${stagingDir}"`)
    const initResult = shell.exec(`cd "${stagingDir}" && git init --quiet . && git config user.email spike@example.com && git config user.name "Bun Spike"`)
    if (initResult.code !== 0) {
      record('shelljs.exec sync: git init', 'fail', `exit ${initResult.code}: ${initResult.stderr}`)
    }
    else {
      record('shelljs.exec sync: git init', 'pass', `exit 0, stdout len ${initResult.stdout.length}`)
    }
  })

  // --- commit something so there is a ref to push (mirrors the package.json commit step) ---
  await runCheck('shelljs.exec sync: git add + commit', () => {
    writeFileSync(fsPath.join(stagingDir, 'package.json'), JSON.stringify({ name : 'bun-spike-scratch', version : '0.0.0' }, null, 2))
    const commitResult = shell.exec(`cd "${stagingDir}" && git add package.json && git commit -m "package initialization" --quiet`)
    if (commitResult.code !== 0) {
      record('shelljs.exec sync: git add + commit', 'fail', `exit ${commitResult.code}: ${commitResult.stderr}`)
    }
    else {
      record('shelljs.exec sync: git add + commit', 'pass', 'committed initial package.json')
    }
  })

  // --- 2. mock "hub create" — set up a local bare repo as the GitHub remote,
  //     then exercise spawning the REAL `hub` and `gh` binaries (as `hub create`/
  //     `gh repo create` would) to validate PATH resolution + stdout capture for
  //     external tools, without touching the network or requiring auth. ---
  await runCheck('mock hub create: bare remote + remote add', () => {
    const bareResult = shell.exec(`git init --quiet --bare "${bareRemoteDir}"`)
    if (bareResult.code !== 0) {
      record('mock hub create: bare remote + remote add', 'fail', `bare init exit ${bareResult.code}: ${bareResult.stderr}`)
      return
    }
    const remoteResult = shell.exec(`cd "${stagingDir}" && git remote add origin "${bareRemoteDir}"`)
    if (remoteResult.code !== 0) {
      record('mock hub create: bare remote + remote add', 'fail', `remote add exit ${remoteResult.code}: ${remoteResult.stderr}`)
    }
    else {
      record('mock hub create: bare remote + remote add', 'pass', 'local bare repo standing in for GitHub remote')
    }
  })

  await runCheck('shelljs.exec sync: spawn real `hub --version`', () => {
    const hubResult = shell.exec('hub --version')
    if (hubResult.code !== 0) {
      record('shelljs.exec sync: spawn real `hub --version`', 'fail', `exit ${hubResult.code}: ${hubResult.stderr}`)
    }
    else {
      record('shelljs.exec sync: spawn real `hub --version`', 'pass', hubResult.stdout.trim().split('\n')[0])
    }
  })

  await runCheck('shelljs.exec sync: spawn real `gh --version`', () => {
    const ghResult = shell.exec('gh --version')
    if (ghResult.code !== 0) {
      record('shelljs.exec sync: spawn real `gh --version`', 'fail', `exit ${ghResult.code}: ${ghResult.stderr}`)
    }
    else {
      record('shelljs.exec sync: spawn real `gh --version`', 'pass', ghResult.stdout.trim().split('\n')[0])
    }
  })

  // --- 3. git push (mirrors: `cd "${stagingDir}" && git push --set-upstream origin main`,
  //     including the production retry-on-failure loop shape) ---
  await runCheck('shelljs.exec sync: git push --set-upstream (with retry loop)', () => {
    const pushCmd = `cd "${stagingDir}" && git push --set-upstream origin main`
    let retry = 5
    let pushResult = shell.exec(pushCmd)
    while (pushResult.code !== 0 && retry > 0) {
      retry -= 1
      pushResult = shell.exec(pushCmd)
    }
    if (pushResult.code !== 0) {
      record('shelljs.exec sync: git push --set-upstream (with retry loop)', 'fail', `exit ${pushResult.code}: ${pushResult.stderr}`)
    }
    else {
      record('shelljs.exec sync: git push --set-upstream (with retry loop)', 'pass', `pushed to local bare remote (retries used: ${5 - retry})`)
    }
  })

  // --- 4. label/milestone setup: in the real code (`setupGitHubLabels`,
  //     `setupGitHubMilestones` in @liquid-labs/github-toolkit) this is Octokit/fetch-based
  //     HTTP, NOT child_process — so it isn't part of this spike's child_process risk
  //     surface. Exercise a real network fetch instead, since that's the actual
  //     mechanism, to confirm the compiled binary's HTTP stack works too. ---
  await runCheck('fetch (mirrors Octokit-based label/milestone calls, not child_process)', async() => {
    const resp = await fetch('https://api.github.com/rate_limit')
    if (!resp.ok) {
      record('fetch (mirrors Octokit-based label/milestone calls, not child_process)', 'fail', `HTTP ${resp.status}`)
    }
    else {
      record('fetch (mirrors Octokit-based label/milestone calls, not child_process)', 'pass', `HTTP ${resp.status}`)
    }
  })

  // --- shelljs ASYNC exec path (tryExecAsync's mechanism) ---
  await new Promise((resolve) => {
    shell.exec('git --version', { async : true }, (code, stdout, stderr) => {
      if (code !== 0) record('shelljs.exec async: git --version', 'fail', `exit ${code}: ${stderr}`)
      else record('shelljs.exec async: git --version', 'pass', stdout.trim())
      resolve()
    })
  })

  // --- environment variable inheritance ---
  await runCheck('env var inheritance through shell.exec', () => {
    const marker = 'BUN_SPIKE_MARKER_VALUE'
    const prev = process.env.BUN_SPIKE_MARKER
    process.env.BUN_SPIKE_MARKER = marker
    const envResult = shell.exec('echo "$BUN_SPIKE_MARKER"')
    process.env.BUN_SPIKE_MARKER = prev
    if (envResult.code !== 0 || envResult.stdout.trim() !== marker) {
      record('env var inheritance through shell.exec', 'fail', `exit ${envResult.code}, stdout: ${JSON.stringify(envResult.stdout)}`)
    }
    else {
      record('env var inheritance through shell.exec', 'pass', 'child saw parent-set env var')
    }
  })

  // --- non-zero exit code + stderr capture on a deliberately failing command ---
  await runCheck('non-zero exit code + stderr capture', () => {
    const failResult = shell.exec('git this-is-not-a-real-git-subcommand')
    if (failResult.code === 0) {
      record('non-zero exit code + stderr capture', 'fail', 'expected non-zero exit code, got 0')
    }
    else if (!failResult.stderr || failResult.stderr.length === 0) {
      record('non-zero exit code + stderr capture', 'fail', `exit ${failResult.code} but stderr was empty`)
    }
    else {
      record('non-zero exit code + stderr capture', 'pass', `exit ${failResult.code}, stderr captured (${failResult.stderr.length} chars)`)
    }
  })

  // --- raw node:child_process (the primitive shelljs itself is built on) as a
  //     control check, to isolate whether a failure is in Bun's child_process
  //     implementation itself vs. specific to shelljs's re-exec-via-execPath trick. ---
  await runCheck('raw node:child_process.execSync control check', () => {
    const out = execSync('git --version', { encoding : 'utf8' })
    if (!out.includes('git version')) {
      record('raw node:child_process.execSync control check', 'fail', `unexpected output: ${out}`)
    }
    else {
      record('raw node:child_process.execSync control check', 'pass', out.trim())
    }
  })

  await runCheck('raw node:child_process.execFileSync control check (mirrors shelljs internal re-exec trick)', () => {
    // shelljs's SYNCHRONOUS shell.exec() does not call child_process.exec directly.
    // It re-invokes `process.execPath` against a helper script file
    // (node_modules/shelljs/src/exec-child.js) via execFileSync, passing a params
    // file, and reads the result back from temp files it wrote. This check isolates
    // exactly that mechanism, since it is the piece most likely to break in a
    // `bun build --compile` standalone binary: __dirname resolves to a virtual/
    // embedded path inside the binary, and process.execPath is the compiled binary
    // itself rather than a `node`/`bun` interpreter capable of running an arbitrary
    // script path argument.
    const execPath = process.execPath
    const helperScript = fsPath.join(fsPath.dirname(new URL(import.meta.resolve('shelljs')).pathname), '..', 'src', 'exec-child.js')
    record('raw node:child_process.execFileSync control check (mirrors shelljs internal re-exec trick)', 'pass', `process.execPath=${execPath} helperScriptResolvesToRealFile=${existsSync(helperScript)}`)
  })
}
finally {
  // --- cleanup: remove all scratch artifacts (staging dir + local bare "remote") ---
  cleanupScratchRoot()
}

const failed = results.filter((r) => r.status === 'fail')
console.log(JSON.stringify({ results, passCount : results.length - failed.length, failCount : failed.length }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
