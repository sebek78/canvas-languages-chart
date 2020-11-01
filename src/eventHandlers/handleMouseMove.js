import {
  VIEW_NAMES,
  LEFT_PADDING,
  TOP_PADDING,
  RIGHT_PADDING,
  BOTTOM_PADDING,
} from "../constants";
import { Maybe } from "../models/wrapper";

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

export const handleMouseMove = (e, view, draw, chartData, chartData2) => {
  if (!delayStartTime) {
    delayStartTime = new Date();
  } else {
    const now = Date.now();

    if (now - delayStartTime > DELAY_TIME) {
      let { offsetX, offsetY } = e;
      let { offsetWidth, offsetHeight } = e.target;
      delayStartTime = null;
      let pointData = null;

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

          pointData = monthlyData
            .filter((lang) => lang.visibility)
            .find(
              (data) =>
                data.value >= y - minDiffValue && data.value <= y + minDiffValue
            );
        }
      } else {
        const maxX = chartData2.getMinMaxTime2().maxX;
        const maxY = chartData2.getMaxY2();
        const x = scaleXtoIndex(offsetX, offsetWidth, maxX);
        const y = scaleYtoValue(offsetY, offsetHeight, maxY);

        if (x < chartData2.getDates2().length) {
          const xDate = getTimestamp([chartData2.getDates2()[x].year]);

          const yearlyData = chartData2
            .getChartData2()
            .map((langData) => langData.filter((lang) => lang.date === xDate))
            .flat();

          const minDiffValue = Math.min(
            ...yearlyData.map((data) =>
              data.visibility ? Math.abs(data.value - y) : MAX_RANGE
            )
          );

          pointData = yearlyData
            .filter((lang) => lang.visibility)
            .find(
              (data) =>
                data.value >= y - minDiffValue && data.value <= y + minDiffValue
            );
        }
      }

      let chartPoint = Maybe.of(pointData);
      if (pointData) draw(chartPoint);
    }
  }
};
