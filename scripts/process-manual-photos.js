const fs = require('fs');
const path = require('path');

const CONFIG = {
  sourceDir: path.join(__dirname, '../photos'),
  outputDir: path.join(__dirname, '../images'),
  jsonOutputPath: path.join(__dirname, '../data/photos.json')
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// Clean up description text
function cleanDescription(desc) {
  // Remove extra whitespace
  desc = desc.replace(/\s+/g, ' ').trim();

  // Remove trailing periods if multiple sentences
  desc = desc.replace(/\.\.$/, '.');

  // Capitalize first letter
  desc = desc.charAt(0).toUpperCase() + desc.slice(1);

  // Add period if missing
  if (!desc.endsWith('.') && !desc.endsWith('!') && !desc.endsWith('?')) {
    desc += '.';
  }

  // Don't truncate - keep full descriptions

  return desc;
}

// Parse filename to extract year and description
function parseFilename(filename) {
  // Format: YEAR-description.ext
  const match = filename.match(/^(\d{4})-(.+)\.(jpg|jpeg|png|webp)$/i);

  if (!match) {
    console.log(`⚠️  Skipping invalid format: ${filename}`);
    return null;
  }

  const year = parseInt(match[1]);
  let description = match[2];
  const ext = match[3].toLowerCase();

  // Clean up description
  description = cleanDescription(description);

  return { year, description, ext };
}

// Main function
async function main() {
  console.log('🚀 Processing manual photos...\n');

  // Read all files from source directory
  const files = fs.readdirSync(CONFIG.sourceDir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  console.log(`📁 Found ${files.length} photos\n`);

  const photos = [];

  files.forEach((filename, index) => {
    const parsed = parseFilename(filename);

    if (!parsed) return;

    const id = String(index + 1).padStart(3, '0');
    const newFilename = `photo-${id}.${parsed.ext === 'jpeg' ? 'jpg' : parsed.ext}`;

    // Copy file to output directory
    const sourcePath = path.join(CONFIG.sourceDir, filename);
    const destPath = path.join(CONFIG.outputDir, newFilename);

    try {
      fs.copyFileSync(sourcePath, destPath);

      photos.push({
        id: id,
        filename: newFilename,
        year: parsed.year,
        description: parsed.description
      });

      console.log(`✅ ${id}: ${parsed.year} - ${parsed.description.substring(0, 60)}${parsed.description.length > 60 ? '...' : ''}`);
    } catch (err) {
      console.log(`❌ Error copying ${filename}: ${err.message}`);
    }
  });

  // Save photos.json
  const photosJson = {
    photos: photos
  };

  fs.writeFileSync(
    CONFIG.jsonOutputPath,
    JSON.stringify(photosJson, null, 2)
  );

  console.log(`\n✅ Done! Processed ${photos.length} photos`);
  console.log(`📄 JSON saved to: ${CONFIG.jsonOutputPath}`);
  console.log(`🖼️  Images saved to: ${CONFIG.outputDir}`);
  console.log(`\n💡 Review the descriptions in photos.json and edit if needed!`);
}

main().catch(console.error);
