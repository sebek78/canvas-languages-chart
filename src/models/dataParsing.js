import { LANGUAGES } from "../constants";
import { Maybe } from "./wrapper";
import * as R from "ramda";

/* chart data */
const diffDate = (a, b) => a.date - b.date;
const sortByDateFn = (data) => R.sort(diffDate, data).reverse();

const appendDate = (monthlyData, date) =>
  monthlyData.map((lang) => `${lang},${Date.parse(date)}`);
const appendDatesToRecordFn = (data) =>
  data.valueOf().map(({ dataset, date }) => appendDate(dataset, date));

const oneArrayFn = (data) => data.valueOf().flat();

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

const findChartPoint = (data, language) =>
  data.filter((record) => record.language === language.name);
const groupDataFn = (data) =>
  LANGUAGES.map((language) => findChartPoint(data.valueOf(), language));

const groupData = (data) => Maybe.of(data).map(groupDataFn);
const parseRecord = (data) => Maybe.of(data).map(parseRecordFn);
const oneArray = (data) => Maybe.of(data).map(oneArrayFn);
const appendDatesToRecord = (data) => Maybe.of(data).map(appendDatesToRecordFn);
const sortByDate = (data) => Maybe.of(data).map(sortByDateFn);

const parseChartData = (data) =>
  R.compose(
    groupData,
    parseRecord,
    oneArray,
    appendDatesToRecord,
    sortByDate
  )(data);

/* Dates */
const getDatesFn = (data) =>
  data
    .map((monthlyData) => ({
      month: Number.parseInt(monthlyData.date.split("-")[1], 10),
      year: Number.parseInt(monthlyData.date.split("-")[0], 10),
    }))
    .reverse();

const getDates = (data) => Maybe.of(data).map(getDatesFn);

/* Legend */
const getLastElementFn = (data) =>
  data.valueOf().map((language) => language[language.length - 1]);

const diffValue = (a, b) => a.value - b.value;
const sortByValueFn = (data) => R.sort(diffValue, data.valueOf()).reverse();

const findColor = (language) =>
  LANGUAGES.find((lang) => lang.name === language).color;

const addColorInfoFn = (data) =>
  data.valueOf().map((rowData) => {
    return { ...rowData, color: findColor(rowData.language) };
  });

const getLastElement = (data) => Maybe.of(data).map(getLastElementFn);
const sortByValue = (data) => Maybe.of(data).map(sortByValueFn);
const addColorInfo = (data) => Maybe.of(data).map(addColorInfoFn);

const parseLegendData = (chartData) =>
  R.compose(addColorInfo, sortByValue, getLastElement)(chartData);

/* Max Y */

const findMaxAndCeilFn = (selectedLanguages) =>
  Math.ceil(Math.max(...selectedLanguages.valueOf()));
const selectVisible = (lang) => (lang.visibility ? lang.value : 0);
const getVisibleLanguagesFn = (chartData) =>
  chartData.valueOf().map(selectVisible);

const getVisibleLanguages = (chartData) =>
  Maybe.of(chartData).map(getVisibleLanguagesFn);
const findMaxAndCeil = (selectedLanguages) =>
  Maybe.of(selectedLanguages).map(findMaxAndCeilFn);

const findMaxValue = (chartData) =>
  R.compose(findMaxAndCeil, getVisibleLanguages, oneArray)(chartData);

export const parseData = (data) => {
  let chartData = parseChartData(data);
  const chartDates = getDates(data);
  const legendData = parseLegendData(chartData);
  let maxY = findMaxValue(chartData);

  const getValue = (wrapper, defaultValue = []) =>
    wrapper.type === "nothing" ? defaultValue : wrapper.valueOf();

  const setNewMaxValue = (chartData) => {
    maxY = Maybe.of(chartData).map(findMaxValue).valueOf();
  };

  return {
    getMaxY: () => getValue(maxY, 1),
    setMaxY: () => setNewMaxValue(chartData),
    getChartData: () => getValue(chartData),
    getDates: () => getValue(chartDates),
    getLegendData: () => getValue(legendData),
  };
};
