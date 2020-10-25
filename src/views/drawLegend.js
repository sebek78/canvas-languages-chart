import { ROW_HEIGTH, BOX_SIZE, LEGEND_Y, VIEW_NAMES } from "../constants";
import { setTextContext } from "./../drawing";
import { getColor } from "../models/common";

/*  Legend */

const drawBox = (ctx, x, y, color, visibility) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, BOX_SIZE, BOX_SIZE);
  if (!visibility) {
    ctx.fillStyle = "black";
    ctx.fillRect(x + 2, y + 2, BOX_SIZE - 4, BOX_SIZE - 4);
  }
};

const drawLegendElement = (
  ctx,
  { language, color, value, visibility },
  x,
  y
) => {
  drawBox(ctx, x, y, color, visibility);
  ctx.fillStyle = visibility ? "white" : "#AAA";
  ctx.fillText(`${language} ${value} %`, x + 30, y + 12);
};

const setLightColor = (match) => (match ? "lime" : "#AAA");

const drawLegendMenu = (ctx, viewName) => {
  setTextContext(ctx);
  ctx.fillStyle = "white";
  ctx.fillText("Searching popularity", 0, 16);

  ctx.fillStyle = setLightColor(viewName === VIEW_NAMES.searchingValues);
  ctx.fillText("Values", 10, 46);

  ctx.fillStyle = setLightColor(viewName === VIEW_NAMES.searchingDuels);
  ctx.fillText("Duels", 90, 46);

  ctx.fillStyle = "white";
  ctx.fillText("Usage", 50, 76);

  ctx.fillStyle = setLightColor(viewName === VIEW_NAMES.usageValues);
  ctx.fillText("Values", 10, 106);

  ctx.fillStyle = setLightColor(viewName === VIEW_NAMES.usageDuels);
  ctx.fillText("Duels", 90, 106);
};

/* Duels */

const drawDuelElement = (ctx, { visibility, languages }, x, y) => {
  ctx.fillStyle = visibility ? "white" : "#AAA";
  ctx.fillRect(x, y, BOX_SIZE, BOX_SIZE);
  if (!visibility) {
    ctx.fillStyle = "black";
    ctx.fillRect(x + 2, y + 2, BOX_SIZE - 4, BOX_SIZE - 4);
  }
  ctx.fillStyle = visibility ? "white" : "#AAA";
  const description = languages.join(" vs ");
  ctx.fillText(`${description}`, x + 30, y + 12);
};

const drawLanguageInfo = (ctx, language, index, y) => {
  const color = getColor(language);
  drawBox(ctx, 30, y, color, true);
  ctx.fillStyle = "white";
  ctx.fillText(`${language}`, 60, y + 12);
};

const drawLegend = (ctx, chartData, viewName, duels) => {
  drawLegendMenu(ctx, viewName);
  ctx.textAlign = "left";
  const LEGEND_Y_INFO = duels.getConfig().length * ROW_HEIGTH;

  if (viewName === VIEW_NAMES.searchingValues) {
    chartData.forEach((languageData, i) => {
      drawLegendElement(ctx, languageData, 0, LEGEND_Y + i * ROW_HEIGTH);
    });
  } else if (viewName === VIEW_NAMES.searchingDuels) {
    duels.getConfig().forEach((duel, i) => {
      drawDuelElement(ctx, duel, 0, LEGEND_Y + i * ROW_HEIGTH);
    });
    duels.getConfig()[duels.getDuelIndex()].languages.forEach((language, i) => {
      const y = LEGEND_Y + LEGEND_Y_INFO + (i + 1) * ROW_HEIGTH;
      drawLanguageInfo(ctx, language, i, y);
    });
  }
  if (viewName === VIEW_NAMES.usageValues) {
    chartData.forEach((languageData, i) => {
      drawLegendElement(ctx, languageData, 0, LEGEND_Y + i * ROW_HEIGTH);
    });
  } else if (viewName === VIEW_NAMES.usageDuels) {
    duels.getConfig().forEach((duel, i) => {
      drawDuelElement(ctx, duel, 0, LEGEND_Y + i * ROW_HEIGTH);
    });
    duels.getConfig()[duels.getDuelIndex()].languages.forEach((language, i) => {
      const y = LEGEND_Y + LEGEND_Y_INFO + (i + 1) * ROW_HEIGTH;
      drawLanguageInfo(ctx, language, i, y);
    });
  }
};

export default drawLegend;
