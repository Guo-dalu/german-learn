#!/usr/bin/env node
/**
 * Generate German word pronunciation MP3s from Google Translate TTS.
 *
 * Usage:
 *   node tools/create-audio.js [options] <path-to-topic.json> [...]
 *   node tools/create-audio.js --all          # all topics under content/vocabulary/
 *
 * Options:
 *   -f, --force   Overwrite existing MP3s (default: skip existing)
 *   --all         Process all content/vocabulary/**\/*.json files
 *
 * Output: public/audio/words/{topic}/{word}.mp3
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_BASE = path.resolve(__dirname, '../content/vocabulary')
const OUTPUT_BASE = path.resolve(__dirname, '../public/audio/words')

// Parse flags
const rawArgs = process.argv.slice(2)
const force = rawArgs.includes('-f') || rawArgs.includes('--force')
const all = rawArgs.includes('--all')
const files = rawArgs.filter((a) => !a.startsWith('-'))

if (!all && files.length === 0) {
  console.error(
    'Usage: node tools/create-audio.js [-f] <topic|topic.json> [...]\n' +
      '       node tools/create-audio.js [-f] --all',
  )
  process.exit(1)
}

function resolveJsonPath(arg) {
  if (arg.endsWith('.json')) return path.resolve(arg)
  // bare topic name → content/vocabulary/{topic}/{topic}.json
  return path.resolve(__dirname, `../content/vocabulary/${arg}/${arg}.json`)
}

function getTTSUrl(word) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=de&client=gtx`
}

async function downloadAudio(word, destPath) {
  const url = getTTSUrl(word)
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = await res.arrayBuffer()
  fs.writeFileSync(destPath, Buffer.from(buffer))
}

async function processFile(jsonPath) {
  const raw = fs.readFileSync(jsonPath, 'utf-8')
  const data = JSON.parse(raw)
  const topic = data.topic

  if (!topic) {
    console.error(`No "topic" field in ${jsonPath}, skipping.`)
    return
  }

  const words = (data.words || []).map((w) => w.german)
  if (words.length === 0) {
    console.log(`No words in ${jsonPath}, skipping.`)
    return
  }

  const outDir = path.join(OUTPUT_BASE, topic)
  fs.mkdirSync(outDir, { recursive: true })

  const toDownload = words.filter((word) => {
    const destPath = path.join(outDir, `${word}.mp3`)
    if (!force && fs.existsSync(destPath)) return false
    return true
  })

  const skipped = words.length - toDownload.length
  console.log(
    `\n[${topic}] ${words.length} words — ${toDownload.length} to download, ${skipped} skipped`,
  )

  for (const word of toDownload) {
    const destPath = path.join(outDir, `${word}.mp3`)
    try {
      await downloadAudio(word, destPath)
      console.log(`  ✓ ${word}`)
    } catch (err) {
      console.error(`  ✗ ${word}: ${err.message}`)
    }
    await new Promise((r) => setTimeout(r, 300))
  }
}

// Collect JSON paths
function getAllTopicJsons() {
  return fs
    .readdirSync(CONTENT_BASE)
    .map((dir) => path.join(CONTENT_BASE, dir, `${dir}.json`))
    .filter((p) => fs.existsSync(p))
}

const jsonPaths = all ? getAllTopicJsons() : files.map(resolveJsonPath)

for (const jsonPath of jsonPaths) {
  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`)
    continue
  }
  await processFile(jsonPath)
}

console.log('\nDone.')
