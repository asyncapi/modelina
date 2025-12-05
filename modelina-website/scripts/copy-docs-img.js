const path = require('path');
const fs = require('fs');

const SOURCE_PATH = path.join(__dirname, '../../docs/img');
const DEST_PATH = path.join(__dirname, '../public/img/docs');

/**
 * Recursively copy a directory (cross-platform)
 */
function copyDirSync(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy docs images to public folder in a cross-platform way
 */
function copyDocsImages() {
  try {
    copyDirSync(SOURCE_PATH, DEST_PATH);
    console.log('Images copied successfully!');
  } catch (err) {
    console.error('Error copying images:', err);
    process.exit(1);
  }
}

copyDocsImages();
