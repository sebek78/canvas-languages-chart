import {
  WIDTH,
  HEIGHT,
  LANGUAGES,
  BOTTOM_PADDING,
  TOP_PADDING,
  LEFT_PADDING,
  X_UNIT,
} from "./constants";
import drawCanvas from "./views/drawCanvas";
import drawChart from "./views/drawChart";
import drawLegend from "./views/drawLegend";

const relativeY = (maxY) => (HEIGHT - TOP_PADDING - BOTTOM_PADDING) / maxY;

export const scaleY = (value, maxY) =>
  HEIGHT - BOTTOM_PADDING - Math.round(value * relativeY(maxY), 10);

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

const drawLanguage = (ctx, language, maxY) => {
  const color = getLanguageColor(language[0].language);
  language.forEach((record, i) => {
    const x1 = scaleX(i);
    const y1 = scaleY(record.value, maxY);
    if (i > 0) {
      const x2 = scaleX(i - 1);
      const y2 = scaleY(language[i - 1].value, maxY);
      drawLanguageLine(ctx, x1, y1, x2, y2, color);
    }
  });
};

const ctx = createCtx();

const drawing = (chartData, dates, legendData, maxY) => {
  drawCanvas(ctx);
  drawChart(ctx, dates, maxY);
  chartData.forEach((language) => {
    if (language[0].visibility) drawLanguage(ctx, language, maxY);
  });
  drawLegend(ctx, legendData);
};

export const createView = ({ getChartData, getDates, getLegendData, getMaxY }) => ({
  draw: () => drawing(getChartData(), getDates(), getLegendData(), getMaxY()),
});