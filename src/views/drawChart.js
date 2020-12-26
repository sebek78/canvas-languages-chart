import {
  LEFT_PADDING,
  RIGHT_PADDING,
  TOP_PADDING,
  BOTTOM_PADDING,
} from "../constants";
import { scaleY, scaleX } from "../drawing";

const TICK_LENGTH = 9;
const CHART_VALUES = [1, 2, 4, 8, 16, 32, 64];

/* Y axis */

const drawYaxis = (ctx) => {
  ctx.fillRect(
    LEFT_PADDING,
    TOP_PADDING,
    1,
    ctx.canvas.height - TOP_PADDING - BOTTOM_PADDING
  );
};

const drawTickY = (ctx, y, maxY) => {
  ctx.fillRect(
    LEFT_PADDING - Math.floor(TICK_LENGTH / 2),
    scaleY(ctx, y, maxY),
    TICK_LENGTH,
    1
  );
};

const drawYticks = (ctx, maxY) => {
  for (let y = 1; y <= maxY; y++) {
    drawTickY(ctx, y, maxY);
  }
};

function drawYvalues(ctx, maxY) {
  ctx.textAlign = "right";
  CHART_VALUES.forEach((value) => {
    if (value < maxY)
      ctx.fillText(
        `${value} %`,
        LEFT_PADDING - 10,
        scaleY(ctx, value, maxY) + 2
      );
  });
  ctx.fillText(`${maxY} %`, LEFT_PADDING - 10, scaleY(ctx, maxY, maxY) + 2);
}

/* X axis */

const drawXaxis = (ctx) => {
  ctx.fillRect(
    LEFT_PADDING,
    ctx.canvas.height - BOTTOM_PADDING,
    ctx.canvas.width - LEFT_PADDING - RIGHT_PADDING,
    1
  );
};

const drawTickX = (ctx, x, maxX) => {
  ctx.fillRect(
    scaleX(ctx, x, maxX),
    ctx.canvas.height - BOTTOM_PADDING - Math.floor(TICK_LENGTH / 2),
    1,
    TICK_LENGTH
  );
};

const drawXticks = (ctx, maxX) => {
  for (let x = 1; x <= maxX; x++) {
    drawTickX(ctx, x, maxX);
  }
};

const drawFillText = (ctx, date, x, dates, lowerText) => {
  const marginBottom = lowerText ? 10 : 28; // pixels
  ctx.fillText(
    date,
    scaleX(ctx, x, dates.length - 1),
    ctx.canvas.height - marginBottom
  );
};

const drawXValues = (ctx, dates) => {
  ctx.textAlign = "center";
  dates.forEach((date, x) => {
    if (date.month) {
      drawFillText(ctx, date.month, x, dates, false);
      if (x === 0) drawFillText(ctx, date.year, x, dates, true);
    } else {
      drawFillText(ctx, date.year, x, dates, false);
    }
  });
};

/* Background lines */

const drawChartBackgroundLine = (ctx, value, maxY) => {
  ctx.fillRect(
    LEFT_PADDING,
    scaleY(ctx, value, maxY),
    ctx.canvas.width - RIGHT_PADDING - LEFT_PADDING,
    1
  );
};

const drawBackgoundLines = (ctx, maxY) => {
  CHART_VALUES.forEach((value) => {
    if (value <= maxY) drawChartBackgroundLine(ctx, value, maxY);
  });
};

const drawChart = (ctx, dates, maxY, { maxX }) => {
  ctx.fillStyle = "#555";
  drawBackgoundLines(ctx, maxY);
  ctx.fillStyle = "white";
  drawYaxis(ctx);
  drawYticks(ctx, maxY);
  drawYvalues(ctx, maxY);
  drawXaxis(ctx);
  drawXticks(ctx, maxX);
  drawXValues(ctx, dates);
};

export default drawChart;
