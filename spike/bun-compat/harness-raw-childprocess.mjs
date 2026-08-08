#!/usr/bin/env bun
/**
 * Differential-diagnosis variant of harness.mjs: identical git/hub/gh/env/exit-code
 * checks, but using raw `node:child_process` (execSync/exec) directly instead of
 * shelljs, to isolate whether a compiled-binary failure is in Bun's own
 * `child_process` support or specific to shelljs's dynamic-require command-loading
 * design (see harness.mjs's header comment and the findings report).
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import * as fsPath from 'node:path'
import { execSync, exec as execAsyncCb } from 'node:child_process'

const results = []
const record = (name, status, detail) => {
  results.push({ name, status, detail })
  process.stderr.write(`[${status === 'pass' ? 'PASS' : 'FAIL'}] ${name}${detail ? ' - ' + detail : ''}\n`)
}

const scratchRoot = mkdtempSync(fsPath.join(tmpdir(), 'sdlcpilot-bun-spike-raw-'))
const stagingDir = fsPath.join(scratchRoot, 'staging-project')
const bareRemoteDir = fsPath.join(scratchRoot, 'mock-origin.git')

// --- cleanup helper, shared between the normal try/finally path below and the
//     SIGINT/SIGTERM handlers, so a manual Ctrl+C mid-run still removes the
//     scratch directory instead of bypassing the finally block. ---
const cleanupScratchRoot = () => {
  try {
    rmSync(scratchRoot, { recursive : true, force : true })
  }
  catch (e) {
    process.stderr.write(`WARNING: cleanup failed: ${e.message}\n`)
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
  try {
    execSync(`mkdir -p "${stagingDir}"`)
    execSync(`git init --quiet . && git config user.email spike@example.com && git config user.name "Bun Spike"`, { cwd : stagingDir })
    record('execSync: git init', 'pass', 'ok')
  }
  catch (e) {
    record('execSync: git init', 'fail', e.message)
  }

  try {
    writeFileSync(fsPath.join(stagingDir, 'package.json'), JSON.stringify({ name : 'bun-spike-scratch-raw', version : '0.0.0' }, null, 2))
    execSync('git add package.json && git commit -m "package initialization" --quiet', { cwd : stagingDir })
    record('execSync: git add + commit', 'pass', 'ok')
  }
  catch (e) {
    record('execSync: git add + commit', 'fail', e.message)
  }

  try {
    execSync(`git init --quiet --bare "${bareRemoteDir}"`)
    execSync(`git remote add origin "${bareRemoteDir}"`, { cwd : stagingDir })
    record('execSync: mock hub create (bare remote)', 'pass', 'ok')
  }
  catch (e) {
    record('execSync: mock hub create (bare remote)', 'fail', e.message)
  }

  try {
    const out = execSync('hub --version', { encoding : 'utf8' })
    record('execSync: spawn real `hub --version`', 'pass', out.trim().split('\n')[0])
  }
  catch (e) {
    record('execSync: spawn real `hub --version`', 'fail', e.message)
  }

  try {
    const out = execSync('gh --version', { encoding : 'utf8' })
    record('execSync: spawn real `gh --version`', 'pass', out.trim().split('\n')[0])
  }
  catch (e) {
    record('execSync: spawn real `gh --version`', 'fail', e.message)
  }

  try {
    // mirrors create-lib.mjs's `git init --quiet . && npm init -y > /dev/null`
    const npmDir = fsPath.join(scratchRoot, 'npm-check')
    execSync(`mkdir -p "${npmDir}"`)
    execSync('npm init -y', { cwd : npmDir, encoding : 'utf8' })
    record('execSync: spawn real `npm init -y`', 'pass', 'exit 0')
  }
  catch (e) {
    record('execSync: spawn real `npm init -y`', 'fail', e.message)
  }

  try {
    execSync('git push --set-upstream origin main', { cwd : stagingDir })
    record('execSync: git push --set-upstream', 'pass', 'ok')
  }
  catch (e) {
    record('execSync: git push --set-upstream', 'fail', e.message)
  }

  await new Promise((resolve) => {
    execAsyncCb('git --version', (err, stdout, stderr) => {
      if (err) record('child_process.exec async: git --version', 'fail', err.message)
      else record('child_process.exec async: git --version', 'pass', stdout.trim())
      resolve()
    })
  })

  try {
    const marker = 'BUN_SPIKE_MARKER_VALUE'
    const prev = process.env.BUN_SPIKE_MARKER
    process.env.BUN_SPIKE_MARKER = marker
    const out = execSync('echo "$BUN_SPIKE_MARKER"', { encoding : 'utf8', shell : '/bin/sh' })
    process.env.BUN_SPIKE_MARKER = prev
    if (out.trim() !== marker) record('env var inheritance', 'fail', `got ${JSON.stringify(out)}`)
    else record('env var inheritance', 'pass', 'ok')
  }
  catch (e) {
    record('env var inheritance', 'fail', e.message)
  }

  try {
    execSync('git this-is-not-a-real-git-subcommand', { stdio : 'pipe' })
    record('non-zero exit code + stderr capture', 'fail', 'expected throw, got none')
  }
  catch (e) {
    const stderr = e.stderr ? e.stderr.toString() : ''
    if (e.status && stderr.length > 0) record('non-zero exit code + stderr capture', 'pass', `exit ${e.status}, stderr captured (${stderr.length} chars)`)
    else record('non-zero exit code + stderr capture', 'fail', `status=${e.status} stderrLen=${stderr.length}`)
  }
}
finally {
  cleanupScratchRoot()
}

const failed = results.filter((r) => r.status === 'fail')
console.log(JSON.stringify({ results, passCount : results.length - failed.length, failCount : failed.length }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
