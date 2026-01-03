# Wikimedia Commons Photo Fetcher

Automatically download historical photos from Wikimedia Commons with metadata.

## Quick Start

```bash
cd scripts
node fetch-wikimedia-photos.js
```

## What It Does

1. Searches Wikimedia Commons categories for historical photos
2. Downloads 100 photos automatically (configurable)
3. Extracts year and description from metadata
4. Generates `data/photos.json` with all entries
5. Saves images to `images/` folder

## Configuration

Edit the `CONFIG` object in the script:

```javascript
const CONFIG = {
  numPhotos: 100,        // How many photos to download
  imageWidth: 1200,      // Resize width in pixels
  categories: [...],     // Which decades/categories to search
  outputDir: '../images',
  jsonOutputPath: '../data/photos.json'
};
```

## Categories Included

- 1900s through 2000s photographs
- Historical photographs
- All public domain from Wikimedia Commons

## Output

- **Images:** `images/photo-001.jpg`, `photo-002.jpg`, etc.
- **JSON:** `data/photos.json` with all metadata

## Notes

- Script has built-in rate limiting (500ms between requests)
- Skips photos without year metadata
- Descriptions are auto-trimmed to 150 characters
- All photos are public domain/freely licensed
