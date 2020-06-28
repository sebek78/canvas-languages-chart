import { LANGUAGES } from "./constants";

const parseRecord = (strRecord, date) => {
  const splitted = strRecord.split(",");
  const language = splitted[0];
  const position = Number.parseInt(splitted[1], 10);
  const value = Number.parseFloat(splitted[2]);
  return {
    date: Date.parse(date),
    language,
    position,
    value,
  };
};

const parseMontlyData = ({ dataset, date }) =>
  dataset.map((record) => parseRecord(record, date));

const mergeData = (data) =>
  [].concat(...data.map((montlyData) => parseMontlyData(montlyData)));

const groupData = (mergedData) =>
  LANGUAGES.map((lang) =>
    mergedData.filter((record) => record.language === lang.name)
  );

export const parseData = (data) => groupData(mergeData(data));
