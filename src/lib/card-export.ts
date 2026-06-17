import { fetchImageAsDataUrl } from "@/lib/image";
import { PLACEHOLDER_HEADSHOT } from "@/lib/tmdb";
import { stripQuotes } from "@/lib/text";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawContainedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  boxW: number,
  boxH: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = boxW / boxH;
  let drawW: number;
  let drawH: number;

  if (imgRatio > boxRatio) {
    drawW = boxW;
    drawH = boxW / imgRatio;
  } else {
    drawH = boxH;
    drawW = boxH * imgRatio;
  }

  const drawX = x + (boxW - drawW) / 2;
  const drawY = y + (boxH - drawH) / 2;
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export async function renderPostCardPng({
  actorName,
  postText,
  headshotUrl,
}: {
  actorName: string;
  postText: string;
  headshotUrl: string;
}): Promise<string> {
  const imageDataUrl = await fetchImageAsDataUrl(headshotUrl || PLACEHOLDER_HEADSHOT);
  let img: HTMLImageElement;
  try {
    img = await loadImage(imageDataUrl);
  } catch {
    img = await loadImage(PLACEHOLDER_HEADSHOT);
  }

  const scale = 2;
  const outerPad = 20;
  const cardPad = 32;
  const gap = 24;
  const imgBoxH = 208;
  const imgBoxW = Math.max(120, (img.naturalWidth / img.naturalHeight) * imgBoxH);
  const textMaxWidth = 380;
  const cleanText = stripQuotes(postText);

  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d")!;
  measureCtx.font = "300 18px Inter, system-ui, sans-serif";
  const words = cleanText.split(" ");
  let lines = 1;
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (measureCtx.measureText(test).width > textMaxWidth && line) {
      lines++;
      line = word;
    } else {
      line = test;
    }
  }
  const textHeight = lines * 28;
  const cardInnerH = Math.max(imgBoxH, 40 + textHeight + 24);
  const cardW = cardPad * 2 + imgBoxW + gap + textMaxWidth;
  const cardH = cardPad * 2 + cardInnerH;

  const canvas = document.createElement("canvas");
  canvas.width = (cardW + outerPad * 2) * scale;
  canvas.height = (cardH + outerPad * 2) * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#0A0A0F";
  ctx.fillRect(0, 0, cardW + outerPad * 2, cardH + outerPad * 2);

  const cardX = outerPad;
  const cardY = outerPad;
  const gradient = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  gradient.addColorStop(0, "#0A0A0F");
  gradient.addColorStop(0.6, "#1A1A2E");
  gradient.addColorStop(1, "#12121A");
  roundRect(ctx, cardX, cardY, cardW, cardH, 16);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const imgX = cardX + cardPad;
  const imgY = cardY + cardPad + (cardInnerH - imgBoxH) / 2;

  ctx.save();
  roundRect(ctx, imgX, imgY, imgBoxW, imgBoxH, 16);
  ctx.clip();
  ctx.fillStyle = "#0A0A0F";
  ctx.fillRect(imgX, imgY, imgBoxW, imgBoxH);
  drawContainedImage(ctx, img, imgX, imgY, imgBoxW, imgBoxH);
  ctx.restore();

  ctx.strokeStyle = "rgba(255, 215, 0, 0.2)";
  ctx.lineWidth = 1;
  roundRect(ctx, imgX, imgY, imgBoxW, imgBoxH, 16);
  ctx.stroke();

  const textX = imgX + imgBoxW + gap;
  const textY = cardY + cardPad + 28;

  ctx.fillStyle = "#FFD700";
  ctx.font = "600 24px Georgia, 'Times New Roman', serif";
  ctx.fillText(actorName, textX, textY);

  ctx.fillStyle = "rgba(245, 245, 245, 0.9)";
  ctx.font = "300 18px Inter, system-ui, sans-serif";
  wrapText(ctx, cleanText, textX, textY + 36, textMaxWidth, 28);

  ctx.fillStyle = "#6b7280";
  ctx.font = "500 10px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("GENERATED BY CINEPOST", cardX + cardW - cardPad, cardY + cardH - 16);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}
