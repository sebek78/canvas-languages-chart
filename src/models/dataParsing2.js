import { Maybe } from "./wrapper";
import * as R from "ramda";
import {
  getValue,
  findMaxValue,
  oneArray,
  sortByDate,
  appendDatesToRecord,
  groupData,
  getMinMaxTime,
  sortByValue,
  addColorInfo,
} from "./common";

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

const parseChartData2 = (data) =>
  R.compose(
    groupData,
    parseRecord,
    oneArray,
    appendDatesToRecord,
    sortByDate
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

const getFirstElementFn = (data) =>
  data.valueOf().map((language) => language[0]);
const getFirstElement = (data) => Maybe.of(data).map(getFirstElementFn);
const parseLegendData = (chartData) =>
  R.compose(addColorInfo, sortByValue, getFirstElement)(chartData);

export const parseData2 = (data) => {
  let chartData = parseChartData2(data);
  const chartDates = getDates(data);
  console.log(chartData.valueOf());
  const legendData = parseLegendData(chartData);
  let maxY = findMaxValue(chartData);

  // const setNewMaxValue = (chartData) => {
  //   maxY = Maybe.of(chartData).map(findMaxValue).valueOf();
  // };

  return {
    getDates2: () => getValue(chartDates),
    getMaxY2: () => getValue(maxY, 1),
    getMinMaxTime2: () => getMinMaxTime(getValue(chartData), true),
    getChartData2: () => getValue(chartData),
    getLegendData2: () => getValue(legendData),
    // setMaxY2: () => setNewMaxValue(chartData),
  };
};
