import { getColor, countIndex } from "../models/common";
import { scaleX, scaleY } from "../drawing";

const RADIUS = 6;
const INNER_RADIUS = 4;
const FULL_CIRCLE = [0, 2 * Math.PI, false];

const drawChartPoint = (ctx, chartPoint, { minTime, maxX, dt }, maxY) => {
  if (chartPoint.valueOf() && chartPoint.valueOf().visibility) {
    const pointData = chartPoint.valueOf();
    const index = countIndex(pointData.date, minTime, dt);
    const x = scaleX(ctx, index, maxX);
    const y = scaleY(ctx, pointData.value, maxY);

    ctx.beginPath();
    ctx.arc(x, y, RADIUS, ...FULL_CIRCLE);
    ctx.lineWidth = 3;
    ctx.strokeStyle = getColor(pointData.language);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, INNER_RADIUS, ...FULL_CIRCLE);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.fillText(`${pointData.value} %`, x + 30, y - 20);
  }
};

export default drawChartPoint;
