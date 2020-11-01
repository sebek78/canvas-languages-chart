import { Maybe, getValue } from "./wrapper";
import * as R from "ramda";
import {
  findMaxValue,
  oneArray,
  diffDate,
  appendDatesToRecord,
  groupData,
  getMinMaxTime,
  sortByValue,
  addColorInfo,
  getLastElement,
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

/* chart data */

const parseRecordFn = (data) =>
  data.valueOf().map((record) => {
    const splitted = record.split(",");
    return {
      language: splitted[0],
      value: parseFloat(splitted[1]),
      date: Date.parse(splitted[2]),
      visibility: true,
    };
  });

const parseChartData2 = (data) =>
  R.compose(
    groupData,
    parseRecord,
    oneArray,
    appendDatesToRecord,
    sortByYear
  )(data);

/* chart dates */

const parseRecord = (data) => Maybe.of(data).map(parseRecordFn);

const getDatesFn = (data) =>
  data
    .map((yearlyData) => ({
      year: Number.parseInt(yearlyData.date, 10),
    }))
    .reverse();

const getDates = (data) => Maybe.of(data).map(getDatesFn);

/* legend */

const parseLegendData = (chartData) =>
  R.compose(addColorInfo, sortByValue, getLastElement)(chartData);

export const parseData2 = (data) => {
  let chartData = parseChartData2(data);
  const chartDates = getDates(data);
  const legendData = parseLegendData(chartData);
  let maxY = findMaxValue(chartData);

  const setNewMaxValue = (chartData) => {
    maxY = Maybe.of(chartData).map(findMaxValue).valueOf();
  };

  return {
    getDates2: () => getValue(chartDates),
    getMaxY2: () => getValue(maxY, 1),
    getMinMaxTime2: () => getMinMaxTime(getValue(chartData), true),
    getChartData2: () => getValue(chartData),
    getLegendData2: () => getValue(legendData),
    setMaxY2: () => setNewMaxValue(chartData),
  };
};
