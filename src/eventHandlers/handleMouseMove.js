import {
  VIEW_NAMES,
  LEFT_PADDING,
  TOP_PADDING,
  RIGHT_PADDING,
  BOTTOM_PADDING,
} from "../constants";

let delayStartTime = null;
const DELAY_TIME = 250;
const MAX_RANGE = 100;

const scaleXtoIndex = (x, offsetWidth, maxX) =>
  Math.round(
    ((x - LEFT_PADDING) / (offsetWidth - LEFT_PADDING - RIGHT_PADDING)) * maxX
  );

const scaleYtoValue = (y, offsetHeight, maxY) =>
  maxY -
  ((y - TOP_PADDING) / (offsetHeight - TOP_PADDING - BOTTOM_PADDING)) * maxY;

const getTimestamp = (date) => Date.UTC(...date);

export const handleMouseMove = (
  e,
  view,
  draw,
  chartData
  // chartData2
) => {
  if (!delayStartTime) {
    delayStartTime = new Date();
  } else {
    const now = Date.now();
    let { offsetX, offsetY } = e;
    let { offsetWidth, offsetHeight } = e.target;

    if (now - delayStartTime > DELAY_TIME) {
      delayStartTime = null;
      /* first view */
      if (
        view() === VIEW_NAMES.searchingValues ||
        view() === VIEW_NAMES.searchingDuels
      ) {
        const maxX = chartData.getMinMaxTime().maxX;
        const maxY = chartData.getMaxY();
        const x = scaleXtoIndex(offsetX, offsetWidth, maxX);
        const y = scaleYtoValue(offsetY, offsetHeight, maxY);

        if (x < chartData.getDates().length) {
          const xDate = getTimestamp([
            chartData.getDates()[x].year,
            chartData.getDates()[x].month - 1,
          ]);

          const monthlyData = chartData
            .getChartData()
            .map((langData) => langData.filter((lang) => lang.date === xDate))
            .flat();

          const minDiffValue = Math.min(
            ...monthlyData.map((data) =>
              data.visibility ? Math.abs(data.value - y) : MAX_RANGE
            )
          );

          const pointData = monthlyData
            .filter((lang) => lang.visibility)
            .find(
              (data) =>
                data.value >= y - minDiffValue && data.value <= y + minDiffValue
            );

          if (pointData) {
            chartData.setChartPoint(pointData);
            draw();
          }
        }
      }
    }
  }
};
