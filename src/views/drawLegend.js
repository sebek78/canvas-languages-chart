import { LANGUAGES } from "../constants";
import * as R from "ramda";

const LEGEND_X = 460;
const LEGEND_Y = 50;
const ROW_HEIGTH = 30;

const getLastElement = (data) =>
  data.map((language) => language[language.length - 1]);

const diff = (a, b) => a.value - b.value;

const sortByValue = (data) => R.sort(diff, data).reverse();

const findColor = (language) =>
  LANGUAGES.find((lang) => lang.name === language).color;

const addColorInfo = (data) =>
  data.map((rowData) => {
    return { ...rowData, color: findColor(rowData.language) };
  });

const drawLegendElement = (ctx, { language, color, value }, x, y) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 20, 20);
  ctx.fillStyle = "white";
  ctx.fillText(`${language} ${value.toFixed(2)} %`, x + 30, y + 12);
};

const drawLegend = (ctx, chartData) => {
  ctx.textAlign = "left";
  const legendData = R.pipe(
    getLastElement,
    sortByValue,
    addColorInfo
  )(chartData);

  legendData.forEach((languageData, i) => {
    drawLegendElement(ctx, languageData, LEGEND_X, LEGEND_Y + i * ROW_HEIGTH);
  });
};

export default drawLegend;
