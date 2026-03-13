# tools/

## create-audio.js

Generates German word pronunciation MP3s from Google Translate TTS.

Output: `public/audio/words/{topic}/{word}.mp3`

By default skips existing files. Use `-f` to overwrite.

### Usage

```bash
# Single topic, skip existing
npm run audio -- weather

# Single topic, force overwrite
npm run audio:force -- weather

# All topics, skip existing
npm run audio:all

# All topics, force overwrite
npm run audio:all:force
```

Run the single-topic command after adding a new topic's JSON file.
