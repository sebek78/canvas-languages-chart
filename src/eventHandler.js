import { canvas2, setCanvasSize } from "./drawing";

import {
  LEGEND_Y,
  LEGEND_X,
  ROW_HEIGTH,
  BOX_SIZE,
  VIEW_NAMES,
} from "./constants";

const checkRowLegend = (x, y, rows) => {
  let row = null;
  if (x >= LEGEND_X && y >= LEGEND_Y && y <= LEGEND_Y + rows * ROW_HEIGTH) {
    row = (y - LEGEND_Y) / ROW_HEIGTH;
    row =
      row - Math.trunc(row) <= BOX_SIZE / ROW_HEIGTH ? Math.trunc(row) : null;
  }
  return row;
};

const toggleInLegendVisibility = (element) => ({
  ...element,
  visibility: !element.visibility,
});

const toggleLanguageVisibility = (langData) =>
  langData.map((lang) => ({ ...lang, visibility: !lang.visibility }));

const setLanguageVisibility = (langData, value) =>
  langData.map((lang) => ({ ...lang, visibility: value }));

const setAllVisibility = (chartData, value) => {
  chartData.forEach((langData, index) => {
    chartData[index] = setLanguageVisibility(langData, value);
  });
};

const setSelectedVisibility = (chartData, visibility) => {
  chartData.forEach((langData, index) => {
    chartData[index] = setLanguageVisibility(
      langData,
      visibility[langData[0].language]
    );
  });
};

const setDuelsVisibility = (duels, chartData, index) => {
  const duelsLanguages = duels.getConfig();
  const indexes = duelsLanguages[index].languages
    .map((duelLang) =>
      chartData.findIndex((lang) => lang[0].language === duelLang)
    )
    .filter((index) => index !== -1);
  indexes.forEach((index) => {
    chartData[index] = toggleLanguageVisibility(chartData[index]);
  });
};

const handleLegendClick = (x, y, chartData, legendData, setMaxY) => {
  const rows = chartData.length;
  const selectedRow = checkRowLegend(x, y, rows);
  if (selectedRow !== null) {
    legendData[selectedRow] = toggleInLegendVisibility(legendData[selectedRow]);
    const { language } = legendData[selectedRow];
    const index = chartData.findIndex((lang) => lang[0].language === language);
    chartData[index] = toggleLanguageVisibility(chartData[index]);
    setMaxY();
  }
};

const getPrevVisibility = (legendData) =>
  legendData.reduce((acc, cv) => {
    const lang = {};
    lang[cv.language] = cv.visibility;
    return { ...acc, ...lang };
  }, {});

const handleLegendMenuClick = (
  x,
  y,
  setView,
  chartData,
  duels,
  setMaxY,
  legendData
) => {
  if (x > 0 && x < 70 && y > 35 && y < 55) {
    setView(VIEW_NAMES.searchingValues);
    const langVisibility = getPrevVisibility(legendData);
    setSelectedVisibility(chartData, langVisibility);
    setMaxY();
  } else if (x > 90 && x < 160 && y > 35 && y < 55) {
    setView(VIEW_NAMES.searchingDuels);
    setAllVisibility(chartData, false);
    const index = duels.getDuelIndex();
    setDuelsVisibility(duels, chartData, index);
    setMaxY();
  } else if (x > 0 && x < 70 && y > 95 && y < 115) {
    setView(VIEW_NAMES.usageValues);
  } else if (x > 90 && x < 160 && y > 95 && y < 115) {
    setView(VIEW_NAMES.usageDuels);
  }
};

const handleDuelsClick = (x, y, chartData, setMaxY, duels) => {
  const rows = duels.getConfig().length;
  const selectedRow = checkRowLegend(x, y, rows);
  if (selectedRow !== null) {
    duels.setAllInvisible();
    duels.setVisible(selectedRow);
    setAllVisibility(chartData, false);
    setDuelsVisibility(duels, chartData, selectedRow);
    setMaxY();
  }
};

const handleEvent = (
  { offsetX, offsetY },
  chartData,
  legendData,
  setMaxY,
  draw,
  setView,
  view,
  duels
) => {
  if (offsetY < LEGEND_Y) {
    handleLegendMenuClick(
      offsetX,
      offsetY,
      setView,
      chartData,
      duels,
      setMaxY,
      legendData
    );
  } else {
    if (view() === VIEW_NAMES.searchingValues) {
      handleLegendClick(offsetX, offsetY, chartData, legendData, setMaxY);
    } else if (view() === VIEW_NAMES.searchingDuels) {
      handleDuelsClick(offsetX, offsetY, chartData, setMaxY, duels);
    }
  }
  window.requestAnimationFrame(draw);
};

const eventHandler = (
  { getChartData, getLegendData, setMaxY },
  { draw, setView, view },
  duels
) => {
  canvas2.addEventListener(
    "click",
    (e) =>
      handleEvent(
        e,
        getChartData(),
        getLegendData(),
        setMaxY,
        draw,
        setView,
        view,
        duels
      ),
    false
  );
  window.addEventListener("orientationchange", function () {
    setCanvasSize();
    draw();
  });
  window.addEventListener("resize", function () {
    setCanvasSize();
    draw();
  });
};

export default eventHandler;
