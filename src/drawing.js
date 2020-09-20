import {
  LANGUAGES,
  BOTTOM_PADDING,
  TOP_PADDING,
  LEFT_PADDING,
  RIGHT_PADDING,
  LEGEND_BOTTOM_PADDING,
  LEGEND_MAX_WIDTH,
  CHART_MAX_WIDTH,
  CHART_MAX_HEIGHT,
  MENU_HEIGHT,
  VIEW_NAMES,
  ROW_HEIGTH,
  LEGEND_Y,
} from "./constants";
import drawCanvas from "./views/drawCanvas";
import drawChart from "./views/drawChart";
import drawLegend from "./views/drawLegend";
import drawLanguageLines from "./views/drawLanguages";

/* drawing helpers */

const relativeY = (ctx, maxY) =>
  (ctx.canvas.height - TOP_PADDING - BOTTOM_PADDING) / maxY;

export const scaleY = (ctx, value, maxY) =>
  ctx.canvas.height -
  BOTTOM_PADDING -
  Math.round(value * relativeY(ctx, maxY), 10);

const xUnit = (ctx, maxX) =>
  parseInt((ctx.canvas.width - LEFT_PADDING - RIGHT_PADDING) / maxX, 10);

export const scaleX = (ctx, index, maxX) =>
  Math.round(LEFT_PADDING + xUnit(ctx, maxX) * index);

export const getLanguageColor = (language) =>
  LANGUAGES.find((lang) => lang.name === language).color;

export const setTextContext = (ctx) => {
  ctx.font = "16px sans-serif";
  ctx.textBaseline = "middle";
};

/* Canvas */

export const canvas1 = document.getElementById("canvas1");
export const canvas2 = document.getElementById("canvas2");

const createCtx = () => {
  setCanvasSize();
  const context1 = canvas1.getContext("2d");
  context1.font = "16px sans-serif";
  context1.textBaseline = "middle";
  const context2 = canvas2.getContext("2d");
  context2.font = "16px sans-serif";
  context2.textBaseline = "middle";
  return [context1, context2];
};

export const setCanvasSize = (legendHeight) => {
  const SCROLL_WIDTH = window.innerWidth - document.documentElement.clientWidth;
  const width = window.innerWidth - SCROLL_WIDTH;
  const height = window.innerHeight;

  if (width <= height) {
    canvas1.setAttribute("width", Math.min(width, CHART_MAX_WIDTH));
    canvas1.setAttribute("height", Math.min(width, CHART_MAX_WIDTH));
    canvas2.setAttribute("width", LEGEND_MAX_WIDTH);
    legendHeight && canvas2.setAttribute("height", legendHeight);
  } else {
    canvas1.setAttribute(
      "width",
      Math.min(width - LEGEND_MAX_WIDTH, CHART_MAX_WIDTH)
    );
    canvas1.setAttribute(
      "height",
      Math.min(height - MENU_HEIGHT, CHART_MAX_HEIGHT)
    );
    canvas2.setAttribute("width", LEGEND_MAX_WIDTH);
    legendHeight && canvas2.setAttribute("height", legendHeight);
  }
  if (ctx1 && ctx2) {
    setTextContext(ctx1);
    setTextContext(ctx2);
  }
};

let [ctx1, ctx2] = createCtx();

export const drawing = (chartData, dates, legendData, maxY, viewName) => {
  drawCanvas(ctx1);
  drawCanvas(ctx2);
  drawChart(ctx1, dates, maxY);
  drawLanguageLines(ctx1, chartData, maxY);
  drawLegend(ctx2, legendData, viewName);
};

export const createView = ({
  getChartData,
  getDates,
  getLegendData,
  getMaxY,
}) => {
  let viewName = VIEW_NAMES.searchingValues;
  let legendHeight =
    LEGEND_Y + ROW_HEIGTH * getLegendData().length + LEGEND_BOTTOM_PADDING;
  setCanvasSize(legendHeight);

  return {
    draw: () =>
      drawing(getChartData(), getDates(), getLegendData(), getMaxY(), viewName),
    view: () => viewName,
    setView: (newName) => {
      viewName = newName;
    },
    legendHeight: () => legendHeight,
  };
};
