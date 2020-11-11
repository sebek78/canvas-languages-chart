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

const sortByYearFn = (data) => {
  let dataWithParsedYears = data.map((record) => ({
    ...record,
    date: parseInt(record.date, 10),
  }));
  return R.sort(diffDate, dataWithParsedYears);
};

const sortByYear = (data) => Maybe.of(data).map(sortByYearFn);

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

const parseRecordFn2 = (data) =>
  data.valueOf().map((record) => {
    const splitted = record.split(",");
    return {
      language: splitted[0],
      value: parseFloat(splitted[1]),
      date: Date.parse(splitted[2]),
      visibility: true,
    };
  });

const parseRecord = (data) => Maybe.of(data).map(parseRecordFn);
const parseRecord2 = (data) => Maybe.of(data).map(parseRecordFn2);

const parseChartData = (data) =>
  R.compose(
    groupData,
    parseRecord,
    oneArray,
    appendDatesToRecord,
    sortByDate
  )(data);

const parseChartData2 = (data) =>
  R.compose(
    groupData,
    parseRecord2,
    oneArray,
    appendDatesToRecord,
    sortByYear
  )(data);

/* chart dates */

const getDatesFn = (data) =>
  data
    .map((monthlyData) => ({
      month: Number.parseInt(monthlyData.date.split("-")[1], 10),
      year: Number.parseInt(monthlyData.date.split("-")[0], 10),
    }))
    .reverse();

const getDatesFn2 = (data) =>
  data
    .map((yearlyData) => ({
      year: Number.parseInt(yearlyData.date, 10),
    }))
    .reverse();

const getDates = (data) => Maybe.of(data).map(getDatesFn);
const getDates2 = (data) => Maybe.of(data).map(getDatesFn2);

const getMinMaxValues = (chartData) =>
  getMinMaxTime(getValue(chartData), false);
const getMinMaxValues2 = (chartData) =>
  getMinMaxTime(getValue(chartData), true);

/* Legend */

const parseLegendData = (chartData) =>
  R.compose(addColorInfo, sortByValue, getLastElement)(chartData);

export const parseData = (data, dataset) => {
  let parseFn, getDatesFn, getMinMaxTimeFn;

  if (dataset === 1) {
    parseFn = parseChartData;
    getDatesFn = getDates;
    getMinMaxTimeFn = getMinMaxValues;
  } else {
    parseFn = parseChartData2;
    getDatesFn = getDates2;
    getMinMaxTimeFn = getMinMaxValues2;
  }

  let chartData = parseFn(data);
  const chartDates = getDatesFn(data);
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
    getMinMaxTime: () => getMinMaxTimeFn(getValue(chartData)),
  };
};
