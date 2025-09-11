# PulseNow - Fast Global News

Phase 0 frontend for PulseNow news app - a minimal React PWA that displays the latest news articles.

## What it does

- Fetches news articles from `/api/feed` endpoint
- Displays the first article as a card with image, title, summary, and source
- Shows loading/error states appropriately
- Installable as a PWA via manifest

## API Contract

The app expects `/api/feed` to return an array of article objects:

```json
{
  "id": "string",
  "title": "string", 
  "summary": "string",
  "imageUrl": "string | null",
  "source": { "name": "string", "url": "string" },
  "publishedAt": "ISO 8601 string"
}
```

## Local Development

### With Firebase Emulators (Recommended)

1. Install dependencies: `npm install`
2. Start Firebase emulators (backend functions running on `/api/feed`)
3. Start frontend: `npm start`
4. App will call `/api/feed` via emulator rewrite

### Standalone Development

1. `npm install`
2. `npm start`
3. App will attempt to call `/api/feed` on same origin

## Build & Deploy

1. `npm run build`
2. Output will be in `build/` directory
3. Firebase Hosting should serve from `build/` with SPA fallback and API rewrites

## Firebase Hosting Configuration

The hosting should include:
- Serve static files from `build/`
- Rewrite `/api/**` to Cloud Functions
- SPA fallback: all non-API routes → `/index.html`