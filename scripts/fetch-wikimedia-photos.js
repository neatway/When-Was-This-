const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  numPhotos: 100, // How many photos to download
  imageWidth: 1200, // Resize to this width
  categories: [
    'Historical_photographs',
    '1900s_photographs',
    '1910s_photographs',
    '1920s_photographs',
    '1930s_photographs',
    '1940s_photographs',
    '1950s_photographs',
    '1960s_photographs',
    '1970s_photographs',
    '1980s_photographs',
    '1990s_photographs',
    '2000s_photographs'
  ],
  outputDir: path.join(__dirname, '../images'),
  jsonOutputPath: path.join(__dirname, '../data/photos.json')
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// Fetch images from a category
async function fetchFromCategory(category, limit = 10) {
  return new Promise((resolve, reject) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${category}&cmtype=file&cmlimit=${limit}&format=json`;

    const options = {
      headers: {
        'User-Agent': 'WhenWasThis/1.0 (Educational photo app)'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.query?.categorymembers || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Get image info (URL, description, date)
async function getImageInfo(title) {
  return new Promise((resolve, reject) => {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodedTitle}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=${CONFIG.imageWidth}&format=json`;

    const options = {
      headers: {
        'User-Agent': 'WhenWasThis/1.0 (Educational photo app)'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          const page = pages[Object.keys(pages)[0]];
          const imageInfo = page?.imageinfo?.[0];

          if (!imageInfo) {
            return resolve(null);
          }

          const metadata = imageInfo.extmetadata;
          const description = metadata?.ImageDescription?.value || metadata?.ObjectName?.value || '';
          const dateTime = metadata?.DateTimeOriginal?.value || metadata?.DateTime?.value || '';

          // Extract year from date string
          const yearMatch = dateTime.match(/\b(1[89]\d{2}|20[0-2]\d)\b/);
          const year = yearMatch ? parseInt(yearMatch[1]) : null;

          resolve({
            url: imageInfo.thumburl || imageInfo.url,
            description: stripHtml(description),
            year: year,
            title: title
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Download image
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(CONFIG.outputDir, filename);
    const file = fs.createWriteStream(filepath);

    const protocol = url.startsWith('https') ? https : http;

    const options = {
      headers: {
        'User-Agent': 'WhenWasThis/1.0 (Educational photo app)'
      }
    };

    protocol.get(url, options, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Strip HTML tags
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

// Sanitize filename
function sanitizeFilename(str) {
  return str
    .replace(/^File:/i, '')
    .replace(/[^a-z0-9.-]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .substring(0, 50);
}

// Main function
async function main() {
  console.log('🚀 Starting Wikimedia Commons photo fetch...\n');

  const photos = [];
  let photoCount = 0;
  const photosPerCategory = Math.ceil(CONFIG.numPhotos / CONFIG.categories.length);

  for (const category of CONFIG.categories) {
    if (photoCount >= CONFIG.numPhotos) break;

    console.log(`📁 Fetching from category: ${category}...`);

    try {
      const members = await fetchFromCategory(category, photosPerCategory);

      for (const member of members) {
        if (photoCount >= CONFIG.numPhotos) break;

        try {
          const info = await getImageInfo(member.title);

          if (!info || !info.url || !info.year) {
            console.log(`  ⏭️  Skipping ${member.title} (missing data)`);
            continue;
          }

          const id = String(photoCount + 1).padStart(3, '0');
          const ext = path.extname(info.url) || '.jpg';
          const filename = `photo-${id}${ext}`;

          console.log(`  ⬇️  Downloading: ${filename} (${info.year})`);
          await downloadImage(info.url, filename);

          photos.push({
            id: id,
            filename: filename,
            year: info.year,
            description: info.description.substring(0, 150) || `Historical photo from ${info.year}.`
          });

          photoCount++;

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (err) {
          console.log(`  ❌ Error processing ${member.title}: ${err.message}`);
        }
      }
    } catch (err) {
      console.log(`  ❌ Error fetching category ${category}: ${err.message}`);
    }
  }

  // Save photos.json
  const photosJson = {
    photos: photos
  };

  fs.writeFileSync(
    CONFIG.jsonOutputPath,
    JSON.stringify(photosJson, null, 2)
  );

  console.log(`\n✅ Done! Downloaded ${photos.length} photos`);
  console.log(`📄 JSON saved to: ${CONFIG.jsonOutputPath}`);
  console.log(`🖼️  Images saved to: ${CONFIG.outputDir}`);
}

main().catch(console.error);
