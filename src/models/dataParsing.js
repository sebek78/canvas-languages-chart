import { Maybe, getValue } from "./wrapper";
import * as R from "ramda";
import {
  findMaxValue,
  oneArray,
  diffDate,
  appendDatesToRecord,
  groupData,
  getMinMaxTime,
  getLastElement,
  sortByValue,
  addColorInfo,
} from "./common";

/* sorting */

const splitDateString = (record) => ({
  ...record,
  date: record.date.split("-"),
});

const getYearAndMonth = (date) => [
  parseInt(date[0], 10),
  parseInt(date[1], 10) - 1,
];

const parseDateString = (record) => ({
  ...record,
  date: Date.UTC(...getYearAndMonth(record.date)),
});

const sortByDateFn = (data) => {
  let dataWithParsedDates = data.map(splitDateString).map(parseDateString);
  return R.sort(diffDate, dataWithParsedDates);
};

export const sortByDate = (data) => Maybe.of(data).map(sortByDateFn);

/* chart data */

const parseRecordFn = (data) =>
  data.valueOf().map((record) => {
    const splitted = record.split(",");
    return {
      language: splitted[0],
      position: parseInt(splitted[1], 10),
      value: parseFloat(splitted[2]),
      date: parseInt(splitted[3], 10),
      visibility: true,
    };
  });

const parseRecord = (data) => Maybe.of(data).map(parseRecordFn);

const parseChartData = (data) =>
  R.compose(
    groupData,
    parseRecord,
    oneArray,
    appendDatesToRecord,
    sortByDate
  )(data);

/* chart dates */

const getDatesFn = (data) =>
  data
    .map((monthlyData) => ({
      month: Number.parseInt(monthlyData.date.split("-")[1], 10),
      year: Number.parseInt(monthlyData.date.split("-")[0], 10),
    }))
    .reverse();

const getDates = (data) => Maybe.of(data).map(getDatesFn);

/* Legend */

const parseLegendData = (chartData) =>
  R.compose(addColorInfo, sortByValue, getLastElement)(chartData);

export const parseData = (data) => {
  let chartData = parseChartData(data);
  const chartDates = getDates(data);
  const legendData = parseLegendData(chartData);
  let maxY = findMaxValue(chartData);

  const setNewMaxValue = (chartData) => {
    maxY = Maybe.of(chartData).map(findMaxValue).valueOf();
  };

  return {
    getMaxY: () => getValue(maxY, 1),
    setMaxY: () => setNewMaxValue(chartData),
    getChartData: () => getValue(chartData),
    getDates: () => getValue(chartDates),
    getLegendData: () => getValue(legendData),
    getMinMaxTime: () => getMinMaxTime(getValue(chartData), false),
  };
};
