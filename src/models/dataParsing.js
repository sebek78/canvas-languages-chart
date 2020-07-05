import { LANGUAGES } from "../constants";
import * as R from "ramda";

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

const diff = (a, b) => a.date - b.date;

const sortByDate = (data) => R.sort(diff, data).reverse();

export const parseData = (data) =>
  R.pipe(sortByDate, buildChartPoints, oneArray, groupData)(data);
