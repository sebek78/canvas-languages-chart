import * as R from "ramda";
import { Maybe } from "./wrapper";
import { LANGUAGES, VIEW_NAMES } from "../constants";

const oneArrayFn = (data) => data.valueOf().flat();
export const oneArray = (data) => Maybe.of(data).map(oneArrayFn);

export const getColor = (language) =>
  LANGUAGES.find((lang) => lang.name === language).color;

/* sorting */

export const diffDate = (a, b) => a.date - b.date; // sort timestamps (number type)

const diffValue = (a, b) => a.value - b.value;
const sortByValueFn = (data) => R.sort(diffValue, data.valueOf()).reverse();
export const sortByValue = (data) => Maybe.of(data).map(sortByValueFn);

/* Max Y */

const selectVisible = (lang) => (lang.visibility ? lang.value : 0);
const getVisibleLanguagesFn = (chartData) =>
  chartData.valueOf().map(selectVisible);
const getVisibleLanguages = (chartData) =>
  Maybe.of(chartData).map(getVisibleLanguagesFn);

const findMaxAndCeilFn = (selectedLanguages) =>
  Math.ceil(Math.max(...selectedLanguages.valueOf()));
const findMaxAndCeil = (selectedLanguages) =>
  Maybe.of(selectedLanguages).map(findMaxAndCeilFn);

export const findMaxValue = (chartData) =>
  R.compose(findMaxAndCeil, getVisibleLanguages, oneArray)(chartData);

/* Gruop by language */

const findChartPoint = (data, language) =>
  data.filter((record) => record.language === language.name);
const groupDataFn = (data) =>
  LANGUAGES.map((language) => findChartPoint(data.valueOf(), language)).filter(
    (element) => element.length
  );
export const groupData = (data) => Maybe.of(data).map(groupDataFn);

/* min time, max time, dt */

export const countIndex = (tx, t0, dt) => Math.round((tx - t0) / dt);

export const getMinMaxTime = (chartData, onlyYears) => {
  let minTime = chartData[0][0].date;
  let maxTime = chartData[0][0].date;
  let dt = 30 * 24 * 60 * 60 * 1000;
  if (onlyYears) dt *= 12;

  chartData.forEach((langData) => {
    langData.forEach((record) => {
      if (record.date < minTime) minTime = record.date;
      if (record.date > maxTime) maxTime = record.date;
    });
  });

  const maxX = countIndex(maxTime, minTime, dt);

  return { minTime, maxX, dt };
};

/* legend */

const getLastElementFn = (data) =>
  data.valueOf().map((language) => language[language.length - 1]);

export const getLastElement = (data) => Maybe.of(data).map(getLastElementFn);

const findColor = (language) =>
  LANGUAGES.find((lang) => lang.name === language).color;

const addColorInfoFn = (data) =>
  data
    .valueOf()
    .filter((record) => !R.isNil(record))
    .map((rowData) => ({ ...rowData, color: findColor(rowData.language) }));

export const addColorInfo = (data) => Maybe.of(data).map(addColorInfoFn);

/* chart data */

export const getData = (chartData, chartData2, viewName) => {
  let data;
  if (
    viewName === VIEW_NAMES.searchingValues ||
    viewName === VIEW_NAMES.searchingDuels
  ) {
    data = chartData;
  } else {
    data = chartData2;
  }
  return data;
};
