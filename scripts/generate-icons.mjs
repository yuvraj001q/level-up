import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const svg = readFileSync(join(root, 'public', 'logo.svg'), 'utf-8');

const sizes = [
  // Favicon
  { file: 'public/favicon.svg', svg: true, width: 32, height: 32 },
  // PWA icons
  { file: 'public/icons/icon-192.svg', svg: true, width: 192, height: 192 },
  { file: 'public/icons/icon-512.svg', svg: true, width: 512, height: 512 },
  // Android mipmap (foreground only, transparent bg for adaptive icon)
  { file: 'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png', svg: false, width: 162, height: 162 },
  { file: 'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png', svg: false, width: 243, height: 243 },
  { file: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png', svg: false, width: 324, height: 324 },
  { file: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png', svg: false, width: 486, height: 486 },
  { file: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png', svg: false, width: 648, height: 648 },
  // Android legacy launcher icons (with bg)
  { file: 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png', svg: false, width: 48, height: 48 },
  { file: 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png', svg: false, width: 72, height: 72 },
  { file: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png', svg: false, width: 96, height: 96 },
  { file: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png', svg: false, width: 144, height: 144 },
  { file: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', svg: false, width: 192, height: 192 },
  // Android round icons
  { file: 'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png', svg: false, width: 48, height: 48 },
  { file: 'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png', svg: false, width: 72, height: 72 },
  { file: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png', svg: false, width: 96, height: 96 },
  { file: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png', svg: false, width: 144, height: 144 },
  { file: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png', svg: false, width: 192, height: 192 },
];

async function main() {
  for (const s of sizes) {
    const fullPath = join(root, s.file);
    mkdirSync(dirname(fullPath), { recursive: true });

    if (s.svg) {
      // Resize SVG by modifying viewBox and keeping it as SVG
      const scale = s.width / 1024;
      // Simple SVG scaling — replace viewBox and size attributes
      const scaled = svg
        .replace(/width="1024"/, `width="${s.width}"`)
        .replace(/height="1024"/, `height="${s.height}"`)
        .replace(/viewBox="0 0 1024 1024"/, `viewBox="0 0 1024 1024"`);
      writeFileSync(fullPath, scaled);
      console.log(`✓ ${s.file} (${s.width}x${s.height})`);
    } else {
      // Render PNG from SVG via sharp
      const isForeground = s.file.includes('foreground');
      // For foreground icons: render just the Zap on transparent bg
      // For launcher/round: render full icon with green bg
      let renderSvg = svg;
      if (isForeground) {
        // Extract just the Zap path with white fill
        renderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s.width}" height="${s.height}" viewBox="0 0 1024 1024">
          <path d="M555 170l-256 384h192l-64 300 320-428h-214l214-256z" fill="white"/>
        </svg>`;
      }
      await sharp(Buffer.from(renderSvg))
        .resize(s.width, s.height, { fit: 'contain', background: isForeground ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 74, g: 222, b: 128, alpha: 1 } })
        .png()
        .toFile(fullPath);
      console.log(`✓ ${s.file} (${s.width}x${s.height})`);
    }
  }
  console.log('\nAll icons generated');
}

main().catch(e => { console.error(e); process.exit(1); });
