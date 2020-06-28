import {
  WIDTH,
  HEIGHT,
  MENU_HEIGHT,
  LANGUAGES,
  LEFT_PADDING,
  RIGHT_PADDING,
} from "./constants";
import { scaleY, scaleX, getLanguageColor } from "./chartHelpers";

export const createCtx = () => {
  const canvas = document.getElementById("canvas");
  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);
  const ctx = canvas.getContext("2d");
  ctx.font = "16px sans-serif";
  ctx.textBaseline = "middle";
  return ctx;
};

const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
};

const drawMenu = (ctx) => {
  ctx.fillStyle = "#212121";
  ctx.fillRect(0, 0, WIDTH, MENU_HEIGHT);
};

const drawChartBackground = (ctx) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, MENU_HEIGHT, WIDTH, HEIGHT);
};

function drawFPS(ctx, fps) {
  ctx.fillStyle = "lightblue";
  ctx.fillText(`FPS: ${fps}`, 10, 16);
}

const drawYaxis = (ctx) => {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(50, HEIGHT - 50);
  ctx.stroke();
  ctx.closePath();
};

const drawChartLine = (ctx, value) => {
  const y = scaleY(value);
  ctx.fillStyle = "#555";
  ctx.fillRect(LEFT_PADDING, y, WIDTH - RIGHT_PADDING - 150, 1);
};

const drawBackgoundLines = (ctx) => {
  const values = [1, 2, 4, 8, 16];
  values.forEach((value) => {
    drawChartLine(ctx, value);
  });
};

const drawXaxis = (ctx) => {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, HEIGHT - 50);
  ctx.lineTo(WIDTH - 50, HEIGHT - 50);
  ctx.stroke();
  ctx.closePath();
};

const drawPoint = (ctx, x, y, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.closePath();
};

const drawLanguageLine = (ctx, x1, y1, x2, y2, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
};

const drawLanguage = (ctx, language) => {
  const color = getLanguageColor(language[0].language);
  language.forEach((record, i) => {
    const x1 = scaleX(i);
    const y1 = scaleY(record.value);
    drawPoint(ctx, x1, y1, color);
    if (i > 0) {
      const x2 = scaleX(i - 1);
      const y2 = scaleY(language[i - 1].value);
      drawLanguageLine(ctx, x1, y1, x2, y2, color);
    }
  });
};

const drawLegendElement = (ctx, language, x, y) => {
  ctx.fillStyle = language.color;
  ctx.fillRect(x, y, 20, 20);
  ctx.fillStyle = "white";
  ctx.fillText(`${language.name}`, x + 30, y + 12);
};

const drawLegend = (ctx, LANGUAGES) => {
  const startX = 500;
  const startY = 50;
  LANGUAGES.forEach((language, i) => {
    const y = startY + i * 30;
    drawLegendElement(ctx, language, startX, y);
  });
};

export const drawing = (ctx, state, chartData) => {
  clearCanvas(ctx);
  drawMenu(ctx);
  drawChartBackground(ctx);
  drawFPS(ctx, state.fps);
  drawYaxis(ctx);
  drawXaxis(ctx);
  drawBackgoundLines(ctx);
  chartData.forEach((language) => {
    drawLanguage(ctx, language);
  });
  drawLegend(ctx, LANGUAGES);
};
