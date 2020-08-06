import { LANGUAGES } from "../constants";
import * as R from "ramda";

/* chart data */

const findChartPoint = (data, language) =>
  data.filter((record) => record.language === language.name);

const groupData = (data) =>
  LANGUAGES.map((language) => findChartPoint(data, language));

const oneArray = (data) => data.flat();

const parseRecord = (strRecord, date) => {
  const splitted = strRecord.split(",");
  return {
    date: Date.parse(date),
    language: splitted[0],
    position: Number.parseInt(splitted[1], 10),
    value: Number.parseFloat(splitted[2]),
  };
};

const processMontlyData = (date, dataset) =>
  dataset.map((strRecord) => parseRecord(strRecord, date));

const buildChartPoints = (data) =>
  data.map(({ date, dataset }) => processMontlyData(date, dataset));

const diffDate = (a, b) => a.date - b.date;

const sortByDate = (data) => R.sort(diffDate, data).reverse();

const addVisibility = (data) =>
  data.map((lang) => ({ ...lang, visibility: true }));

export const parseData = (data) =>
  R.pipe(
    sortByDate,
    buildChartPoints,
    oneArray,
    addVisibility,
    groupData
  )(data);

/* Legend */

const getLastElement = (data) =>
  data.map((language) => language[language.length - 1]);

const diffValue = (a, b) => a.value - b.value;

const sortByValue = (data) => R.sort(diffValue, data).reverse();

const findColor = (language) =>
  LANGUAGES.find((lang) => lang.name === language).color;

const addColorInfo = (data) =>
  data.map((rowData) => {
    return { ...rowData, color: findColor(rowData.language) };
  });

const getDates = (data) =>
  data
    .map((monthlyData) => ({
      month: Number.parseInt(monthlyData.date.split("-")[1], 10),
      year: Number.parseInt(monthlyData.date.split("-")[0], 10),
    }))
    .reverse();

export const parseLegendData = (chartData) =>
  R.pipe(getLastElement, sortByValue, addColorInfo)(chartData);

const findMaxValue = (chartData) =>
  Math.ceil(Math.max(...chartData.map(langData => langData.map(lang => lang.visibility ? lang.value : 0)).flat()));

export const parseChartData = (data) => {
  const chartData = parseData(data);
  const dates = getDates(data);
  const legendData = parseLegendData(chartData);
  let maxY = findMaxValue(chartData);
  return {
    getMaxY: () => maxY,
    setMaxY: () => { maxY = findMaxValue(chartData); },
    getChartData: () => chartData,
    getDates: () => dates,
    getLegendData: () => legendData,
  }
}
