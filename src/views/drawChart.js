import {
  HEIGHT,
  WIDTH,
  LEFT_PADDING,
  RIGHT_PADDING,
  TOP_PADDING,
  BOTTOM_PADDING,
  MAX_Y_CHART_VALUE,
  MAX_X_CHART_VALUE,
} from "../constants";
import { scaleY, scaleX } from "../drawing";

const TICK_LENGTH = 7;
const CHART_VALUES = [1, 2, 4, 8, 16];

/* Y axis */

const drawYaxis = (ctx) => {
  ctx.fillRect(
    LEFT_PADDING,
    TOP_PADDING,
    1,
    HEIGHT - TOP_PADDING - BOTTOM_PADDING
  );
};

const drawTickY = (ctx, y) => {
  ctx.fillRect(
    LEFT_PADDING - Math.floor(TICK_LENGTH / 2),
    scaleY(y),
    TICK_LENGTH,
    1
  );
};

const drawYticks = (ctx) => {
  for (let y = 1; y <= MAX_Y_CHART_VALUE; y++) {
    drawTickY(ctx, y);
  }
};

function drawYvalues(ctx) {
  ctx.textAlign = "right";
  CHART_VALUES.forEach((value) =>
    ctx.fillText(`${value} %`, LEFT_PADDING - 10, scaleY(value) + 2)
  );
}

/* X axis */

const drawXaxis = (ctx) => {
  ctx.fillRect(
    LEFT_PADDING,
    HEIGHT - BOTTOM_PADDING,
    WIDTH - LEFT_PADDING - RIGHT_PADDING,
    1
  );
};

const drawTickX = (ctx, x) => {
  ctx.fillRect(
    scaleX(x),
    HEIGHT - BOTTOM_PADDING - Math.floor(TICK_LENGTH / 2),
    1,
    TICK_LENGTH
  );
};

const drawXticks = (ctx) => {
  for (let x = 1; x <= MAX_X_CHART_VALUE; x++) {
    drawTickX(ctx, x);
  }
};

const drawXValues = (ctx, dates) => {
  ctx.textAlign = "center";
  dates.forEach((date, x) => {
    ctx.fillText(date.month, scaleX(x), HEIGHT - 32);
    if (x === 0) ctx.fillText(date.year, scaleX(x), HEIGHT - 12);
  });
};

/* Background lines */

const drawChartBackgroundLine = (ctx, value) => {
  ctx.fillRect(LEFT_PADDING, scaleY(value), WIDTH - RIGHT_PADDING - 200, 1);
};

const drawBackgoundLines = (ctx) => {
  CHART_VALUES.forEach((value) => {
    drawChartBackgroundLine(ctx, value);
  });
};

const drawChart = (ctx, dates) => {
  ctx.fillStyle = "white";
  drawYaxis(ctx);
  drawYticks(ctx);
  drawYvalues(ctx);
  drawXaxis(ctx);
  drawXticks(ctx);
  drawXValues(ctx, dates);
  ctx.fillStyle = "#555";
  drawBackgoundLines(ctx);
};

export default drawChart;
