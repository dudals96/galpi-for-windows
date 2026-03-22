import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const svgPath = path.join(__dirname, 'icon-final.svg')
const svgBuf = fs.readFileSync(svgPath)

const outDir = path.join(__dirname, '..', 'public', 'icons')
fs.mkdirSync(outDir, { recursive: true })

const sizes = [16, 48, 128]

for (const size of sizes) {
  const outPath = path.join(outDir, `icon${size}.png`)
  await sharp(svgBuf)
    .resize(size, size)
    .png()
    .toFile(outPath)
  console.log(`✓ icon${size}.png`)
}

// 스토어용 고해상도 (440x280 프로모션 타일용 원본도 생성)
const storePath = path.join(__dirname, 'icon-store-512.png')
await sharp(svgBuf).resize(512, 512).png().toFile(storePath)
console.log('✓ icon-store-512.png (스토어용)')

console.log('\n모든 아이콘 생성 완료!')
