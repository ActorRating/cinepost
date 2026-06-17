import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCALE = 3;

const ACTOR = "Leonardo DiCaprio";
const POST_TEXT =
  "DiCaprio's mastery of nuance and intensity is unparalleled, from Titanic's heartthrob to Wolf of Wall Street's wild excess, a chameleon of the screen.";

function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return env;
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length > maxCharsPerLine && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function fetchHeadshot(apiKey) {
  const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(ACTOR)}`;
  const res = await fetch(searchUrl);
  const data = await res.json();
  const profilePath = data.results?.[0]?.profile_path;
  if (!profilePath) throw new Error("Headshot not found");

  const imgUrl = `https://image.tmdb.org/t/p/w780${profilePath}`;
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) throw new Error("Failed to fetch headshot image");
  return Buffer.from(await imgRes.arrayBuffer());
}

async function roundedImage(buffer, width, height, radius) {
  const mask = Buffer.from(
    `<svg width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/></svg>`
  );
  return sharp(buffer)
    .resize(width, height, {
      fit: "contain",
      background: { r: 10, g: 10, b: 15, alpha: 1 },
    })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function main() {
  const env = loadEnv();
  const headshotBuf = await fetchHeadshot(env.TMDB_API_KEY);
  const headshotMeta = await sharp(headshotBuf).metadata();

  const outerPad = 20;
  const cardPad = 32;
  const gap = 24;
  const imgBoxH = 208;
  const textMaxWidth = 380;
  const imgBoxW = Math.max(120, (headshotMeta.width / headshotMeta.height) * imgBoxH);

  const bodyLines = wrapText(POST_TEXT, 52);
  const textHeight = bodyLines.length * 28;
  const cardInnerH = Math.max(imgBoxH, 40 + textHeight + 24);
  const cardW = cardPad * 2 + imgBoxW + gap + textMaxWidth;
  const cardH = cardPad * 2 + cardInnerH;

  const totalW = Math.round((cardW + outerPad * 2) * SCALE);
  const totalH = Math.round((cardH + outerPad * 2) * SCALE);

  const s = SCALE;
  const cardXs = outerPad * s;
  const cardYs = outerPad * s;
  const cardWs = cardW * s;
  const cardHs = cardH * s;
  const imgXs = (outerPad + cardPad) * s;
  const imgYs = (outerPad + cardPad + (cardInnerH - imgBoxH) / 2) * s;
  const imgWs = Math.round(imgBoxW * s);
  const imgHs = Math.round(imgBoxH * s);
  const textXs = (outerPad + cardPad + imgBoxW + gap) * s;
  const textYs = (outerPad + cardPad + 28) * s;

  const headshotRounded = await roundedImage(headshotBuf, imgWs, imgHs, 16 * s);

  const bodyTspans = bodyLines
    .map((line, i) => `<tspan x="${textXs}" dy="${i === 0 ? 0 : 28 * s}">${escapeXml(line)}</tspan>`)
    .join("");

  const cardSvg = Buffer.from(`<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0A0A0F"/>
        <stop offset="60%" stop-color="#1A1A2E"/>
        <stop offset="100%" stop-color="#12121A"/>
      </linearGradient>
    </defs>
    <rect x="${cardXs}" y="${cardYs}" width="${cardWs}" height="${cardHs}" rx="${16 * s}" fill="url(#cardBg)" stroke="rgba(255,255,255,0.08)" stroke-width="${s}"/>
    <rect x="${imgXs}" y="${imgYs}" width="${imgWs}" height="${imgHs}" rx="${16 * s}" fill="none" stroke="rgba(255,215,0,0.2)" stroke-width="${s}"/>
    <text x="${textXs}" y="${textYs}" font-family="Georgia, 'Times New Roman', serif" font-size="${24 * s}" font-weight="600" fill="#FFD700">${escapeXml(ACTOR)}</text>
    <text x="${textXs}" y="${textYs + 36 * s}" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="${18 * s}" font-weight="300" fill="rgba(245,245,245,0.9)">${bodyTspans}</text>
    <text x="${cardXs + cardWs - cardPad * s}" y="${cardYs + cardHs - 16 * s}" text-anchor="end" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="${10 * s}" font-weight="500" fill="#6b7280" letter-spacing="${2 * s}">GENERATED BY CINEPOST</text>
  </svg>`);

  const outputPath = path.join(__dirname, "../public/hero-example-card.png");
  await sharp({
    create: {
      width: totalW,
      height: totalH,
      channels: 4,
      background: { r: 10, g: 10, b: 15, alpha: 1 },
    },
  })
    .composite([
      { input: cardSvg, top: 0, left: 0 },
      { input: headshotRounded, top: Math.round(imgYs), left: Math.round(imgXs) },
    ])
    .png({ compressionLevel: 6 })
    .toFile(outputPath);

  const meta = await sharp(outputPath).metadata();
  const stats = fs.statSync(outputPath);
  console.log(`Generated ${outputPath}`);
  console.log(`  ${meta.width}x${meta.height}px, ${Math.round(stats.size / 1024)}KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
