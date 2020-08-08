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
import drawLanguageLines from "./views/drawLanguages";

/* drawing helpers */

const relativeY = (maxY) => (HEIGHT - TOP_PADDING - BOTTOM_PADDING) / maxY;

export const scaleY = (value, maxY) =>
  HEIGHT - BOTTOM_PADDING - Math.round(value * relativeY(maxY), 10);

export const scaleX = (index) => Math.round(LEFT_PADDING + X_UNIT * index);

export const getLanguageColor = (language) =>
  LANGUAGES.find((lang) => lang.name === language).color;

/* Canvas */

export const canvas = document.getElementById("canvas");

const createCtx = () => {
  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);
  const context = canvas.getContext("2d");
  context.font = "16px sans-serif";
  context.textBaseline = "middle";
  return context;
};

const ctx = createCtx();

const drawing = (chartData, dates, legendData, maxY) => {
  drawCanvas(ctx);
  drawChart(ctx, dates, maxY);
  drawLanguageLines(ctx, chartData, maxY);
  drawLegend(ctx, legendData);
};

export const createView = ({
  getChartData,
  getDates,
  getLegendData,
  getMaxY,
}) => ({
  draw: () => drawing(getChartData(), getDates(), getLegendData(), getMaxY()),
});
