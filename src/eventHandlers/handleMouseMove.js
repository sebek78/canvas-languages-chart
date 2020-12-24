import {
  VIEW_NAMES,
  LEFT_PADDING,
  TOP_PADDING,
  RIGHT_PADDING,
  BOTTOM_PADDING,
} from "../constants";
import { Maybe } from "../models/wrapper";
import { getData } from "../models/common";

let delayStartTime = null;
const DELAY_TIME = 100;
const MAX_RANGE = 100;

const scaleXtoIndex = (x, offsetWidth, maxX) =>
  Math.round(
    ((x - LEFT_PADDING) / (offsetWidth - LEFT_PADDING - RIGHT_PADDING)) * maxX
  );

const scaleYtoValue = (y, offsetHeight, maxY) =>
  maxY -
  ((y - TOP_PADDING) / (offsetHeight - TOP_PADDING - BOTTOM_PADDING)) * maxY;

const getTimestamp = (date) => Date.UTC(...date);

const getMaxXY = (data) => {
  const maxX = data.getMinMaxTime().maxX;
  const maxY = data.getMaxY();
  return { maxX, maxY };
};

const onChart = (offsetX, offsetY, offsetWidth, offsetHeight) =>
  offsetX - LEFT_PADDING > 0 &&
  offsetX < offsetWidth - RIGHT_PADDING &&
  offsetY < offsetHeight - BOTTOM_PADDING &&
  offsetY - TOP_PADDING > 0;

export const handleMouseMove = (e, view, draw, chartData, chartData2) => {
  if (!delayStartTime) {
    delayStartTime = new Date();
  } else {
    const now = Date.now();

    if (now - delayStartTime > DELAY_TIME) {
      let { offsetX, offsetY } = e;
      let { offsetWidth, offsetHeight } = e.target;
      delayStartTime = null;
      let pointData, xDate;

      const data = getData(chartData, chartData2, view());
      const { maxX, maxY } = getMaxXY(data);
      const x = scaleXtoIndex(offsetX, offsetWidth, maxX);
      const y = scaleYtoValue(offsetY, offsetHeight, maxY);

      if (
        view() === VIEW_NAMES.searchingValues ||
        view() === VIEW_NAMES.searchingDuels
      ) {
        if (x >= 0 && x < data.getDates().length) {
          xDate = getTimestamp([
            data.getDates()[x].year,
            data.getDates()[x].month - 1,
          ]);
        }
      } else {
        if (x < data.getDates().length) {
          xDate = getTimestamp([data.getDates()[x].year]);
        }
      }

      const xData = chartData
        .getChartData()
        .map((langData) => langData.filter((lang) => lang.date === xDate))
        .flat();

      const minDiffValue = Math.min(
        ...xData.map((data) =>
          data.visibility ? Math.abs(data.value - y) : MAX_RANGE
        )
      );

      pointData = xData
        .filter((lang) => lang.visibility)
        .find(
          (data) =>
            data.value >= y - minDiffValue && data.value <= y + minDiffValue
        );

      const isOnChart = onChart(offsetX, offsetY, offsetWidth, offsetHeight);
      let chartPoint = isOnChart ? Maybe.of(pointData) : Maybe.of(null);

      if (pointData) draw(chartPoint);
    }
  }
};
