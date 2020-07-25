import { LEGEND_X, LEGEND_Y, ROW_HEIGTH, BOX_SIZE } from "../constants";

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
  ctx.fillStyle = "white";
  ctx.fillText(`${language} ${value.toFixed(2)} %`, x + 30, y + 12);
};

const drawLegend = (ctx, chartData) => {
  ctx.textAlign = "left";
  chartData.forEach((languageData, i) => {
    drawLegendElement(ctx, languageData, LEGEND_X, LEGEND_Y + i * ROW_HEIGTH);
  });
};

export default drawLegend;
