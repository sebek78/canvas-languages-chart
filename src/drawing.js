import {
  WIDTH,
  HEIGHT,
  LANGUAGES,
  BOTTOM_PADDING,
  MAX_Y_CHART_VALUE,
  TOP_PADDING,
  LEFT_PADDING,
  X_UNIT,
} from "./constants";
import drawCanvas from "./views/drawCanvas";
import drawChart from "./views/drawChart";
import drawLegend from "./views/drawLegend";

const relativeY = (HEIGHT - TOP_PADDING - BOTTOM_PADDING) / MAX_Y_CHART_VALUE;

export const scaleY = (value) =>
  HEIGHT - BOTTOM_PADDING - Math.round(value * relativeY, 10);

export const scaleX = (index) => Math.round(LEFT_PADDING + X_UNIT * index);

export const getLanguageColor = (language) =>
  LANGUAGES.find((lang) => lang.name === language).color;

export const canvas = document.getElementById("canvas");

const createCtx = () => {
  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);
  const context = canvas.getContext("2d");
  context.font = "16px sans-serif";
  context.textBaseline = "middle";
  return context;
};

const drawLanguageLine = (ctx, x1, y1, x2, y2, color) => {
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
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
    if (i > 0) {
      const x2 = scaleX(i - 1);
      const y2 = scaleY(language[i - 1].value);
      drawLanguageLine(ctx, x1, y1, x2, y2, color);
    }
  });
};

const ctx = createCtx();

export const drawing = (chartData, dates, legendData) => {
  drawCanvas(ctx);
  drawChart(ctx, dates);
  chartData.forEach((language) => {
    if (language[0].visibility) drawLanguage(ctx, language);
  });
  drawLegend(ctx, legendData);
};
