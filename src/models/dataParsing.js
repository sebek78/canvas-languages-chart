import { Maybe, getValue } from "./wrapper";
import { sort, compose } from "ramda";
import {
  findMaxValue,
  oneArray,
  diffDate,
  groupData,
  getMinMaxTime,
  getLastElement,
  sortByValue,
  addColorInfo,
} from "./common";

/* sorting */

const splitDateString = (data) =>
  data.map((record) => ({
    ...record,
    date: record.date.split("-"),
  }));

const getYearAndMonth = (date) => {
  const splittedDate = [parseInt(date[0], 10)];
  if (date[1]) splittedDate.push(parseInt(date[1], 10) - 1);
  return splittedDate;
};

const parseDateString = (data) =>
  data.map((record) => ({
    ...record,
    date: Date.UTC(...getYearAndMonth(record.date)),
  }));

const sortParsedData = (data) => sort(diffDate, data);

const sortByDateFn = (data) =>
  compose(sortParsedData, parseDateString, splitDateString)(data);

export const sortByDate = (data) => Maybe.of(data).map(sortByDateFn);

/* Append date to record */

const appendDate = (recordData, date) =>
  recordData.map((lang) => `${lang},${date}`);

const appendDatesToRecordFn = (data) =>
  data.valueOf().map(({ dataset, date }) => appendDate(dataset, date));

const appendDatesToRecord = (data) => Maybe.of(data).map(appendDatesToRecordFn);

/* chart data */

const parseRecordFn = (data) =>
  data.valueOf().map((record) => {
    const splitted = record.split(",");
    return {
      language: splitted[0],
      value: parseFloat(splitted[1]),
      date: parseInt(splitted[2], 10),
      visibility: true,
    };
  });

const parseRecord = (data) => Maybe.of(data).map(parseRecordFn);

const parseChartData = (data) =>
  compose(
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
  compose(addColorInfo, sortByValue, getLastElement)(chartData);

export const parseData = (data, dataset) => {
  let getDatesFn, getMinMaxTimeFn;

  if (dataset === 1) {
    getDatesFn = getDates;
    getMinMaxTimeFn = getMinMaxValues;
  } else {
    getDatesFn = getDates2;
    getMinMaxTimeFn = getMinMaxValues2;
  }

  let chartData = parseChartData(data);
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
