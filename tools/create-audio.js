#!/usr/bin/env node
/**
 * Generate German word pronunciation MP3s from Google Translate TTS.
 * Usage: node generate-audio.js <path-to-topic.json> [<path-to-topic2.json> ...]
 * Output: public/audio/words/{topic}/{word}.mp3
 *
 * Install: npm install node-fetch
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_BASE = path.resolve(__dirname, '../public/audio/words')

function getTTSUrl(word) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=de&client=gtx`
}

async function downloadAudio(word, destPath) {
  const url = getTTSUrl(word)
  const res = await fetch(url, {
    headers: {
      // Mimic a browser request to avoid 403
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    },
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for word "${word}"`)
  }

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

  console.log(`\n[${topic}] ${words.length} words → ${outDir}`)

  for (const word of words) {
    const destPath = path.join(outDir, `${word}.mp3`)
    try {
      await downloadAudio(word, destPath)
      console.log(`  ✓ ${word}`)
    } catch (err) {
      console.error(`  ✗ ${word}: ${err.message}`)
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300))
  }
}

// Main
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node generate-audio.js <topic.json> [<topic2.json> ...]')
  process.exit(1)
}

for (const arg of args) {
  const jsonPath = path.resolve(arg)
  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`)
    continue
  }
  await processFile(jsonPath)
}

console.log('\nDone.')
