import { ROW_HEIGTH, BOX_SIZE, LEGEND_Y, VIEW_NAMES } from "../constants";
import { setTextContext } from "./../drawing";

/*  Legend */

const drawLegendElement = (
  ctx,
  { language, color, value, visibility },
  x,
  y
) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, BOX_SIZE, BOX_SIZE);
  if (!visibility) {
    ctx.fillStyle = "black";
    ctx.fillRect(x + 2, y + 2, BOX_SIZE - 4, BOX_SIZE - 4);
  }
  ctx.fillStyle = visibility ? "white" : "#AAA";
  ctx.fillText(`${language} ${value.toFixed(2)} %`, x + 30, y + 12);
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

const drawLegend = (ctx, chartData, viewName, duels) => {
  drawLegendMenu(ctx, viewName);
  ctx.textAlign = "left";
  if (viewName === VIEW_NAMES.searchingValues) {
    chartData.forEach((languageData, i) => {
      drawLegendElement(ctx, languageData, 0, LEGEND_Y + i * ROW_HEIGTH);
    });
  } else if (viewName === VIEW_NAMES.searchingDuels) {
    duels.getConfig().forEach((duel, i) => {
      drawDuelElement(ctx, duel, 0, LEGEND_Y + i * ROW_HEIGTH);
    });
  }
};

export default drawLegend;
