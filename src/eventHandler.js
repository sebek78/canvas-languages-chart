import { canvas2, setCanvasSize } from "./drawing";

import {
  LEGEND_Y,
  LEGEND_X,
  ROW_HEIGTH,
  BOX_SIZE,
  VIEW_NAMES,
} from "./constants";

const checkRowLegend = (x, y, rows) => {
  let row = null;
  if (x >= LEGEND_X && y >= LEGEND_Y && y <= LEGEND_Y + rows * ROW_HEIGTH) {
    row = (y - LEGEND_Y) / ROW_HEIGTH;
    row =
      row - Math.trunc(row) <= BOX_SIZE / ROW_HEIGTH ? Math.trunc(row) : null;
  }
  return row;
};

const toggleInLegendVisibility = (lang) => ({
  ...lang,
  visibility: !lang.visibility,
});

const toggleVisibility = (langData) =>
  langData.map((lang) => ({ ...lang, visibility: !lang.visibility }));

const handleLegendClick = (x, y, chartData, legendData, setMaxY) => {
  const rows = chartData.length;
  const selectedRow = checkRowLegend(x, y, rows);
  if (selectedRow !== null) {
    legendData[selectedRow] = toggleInLegendVisibility(legendData[selectedRow]);
    const { language } = legendData[selectedRow];
    const index = chartData.findIndex((lang) => lang[0].language === language);
    chartData[index] = toggleVisibility(chartData[index]);
    setMaxY();
  }
};

const handleLegendMenuClick = (x, y, setView) => {
  if (x > 0 && x < 70 && y > 35 && y < 55) {
    setView(VIEW_NAMES.searchingValues);
  } else if (x > 90 && x < 160 && y > 35 && y < 55) {
    setView(VIEW_NAMES.searchingDuels);
  } else if (x > 0 && x < 70 && y > 95 && y < 115) {
    setView(VIEW_NAMES.usageValues);
  } else if (x > 90 && x < 160 && y > 95 && y < 115) {
    setView(VIEW_NAMES.usageDuels);
  }
};

const handleEvent = (
  { offsetX, offsetY },
  chartData,
  legendData,
  setMaxY,
  draw,
  setView
) => {
  if (offsetY < LEGEND_Y) {
    handleLegendMenuClick(offsetX, offsetY, setView);
  } else {
    handleLegendClick(offsetX, offsetY, chartData, legendData, setMaxY);
  }
  window.requestAnimationFrame(draw);
};

const eventHandler = (
  { getChartData, getLegendData, setMaxY },
  { draw, setView }
) => {
  canvas2.addEventListener(
    "click",
    (e) =>
      handleEvent(e, getChartData(), getLegendData(), setMaxY, draw, setView),
    false
  );
  window.addEventListener("orientationchange", function () {
    setCanvasSize();
    draw();
  });
  window.addEventListener("resize", function () {
    setCanvasSize();
    draw();
  });
};

export default eventHandler;
