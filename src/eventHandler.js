import { canvas } from "./drawing";
import { LEGEND_Y, LEGEND_X, ROW_HEIGTH, BOX_SIZE } from "./constants";

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

const handleLegendClick = (x, y, chartData, legendData) => {
  const rows = chartData.length;
  const selectedRow = checkRowLegend(x, y, rows);
  if (selectedRow !== null) {
    legendData[selectedRow] = toggleInLegendVisibility(legendData[selectedRow]);
    const { language } = legendData[selectedRow];
    const index = chartData.findIndex((lang) => lang[0].language === language);
    chartData[index] = toggleVisibility(chartData[index]);
  }
};

const handleEvent = ({ offsetX, offsetY }, chartData, legendData, draw) => {
  handleLegendClick(offsetX, offsetY, chartData, legendData);
  window.requestAnimationFrame(draw);
};

const eventHandler = (chartData, legendData, draw) => {
  canvas.addEventListener(
    "click",
    (e) => handleEvent(e, chartData, legendData, draw),
    false
  );
};

export default eventHandler;
