import { canvas1, canvas2, setCanvasSize } from "./drawing";
import { handleMouseMove } from "./eventHandlers/handleMouseMove";

import {
  LEGEND_Y,
  LEGEND_X,
  ROW_HEIGTH,
  BOX_SIZE,
  VIEW_NAMES,
  LEFT_PADDING,
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
  chartData2,
  duels,
  setMaxY,
  setMaxY2,
  legendData,
  legendData2
) => {
  const description = document.querySelector(".description");
  if (x > 0 && x < 70 && y > 35 && y < 55) {
    description.textContent =
      "Searching popularity of some programming languages.";
    setView(VIEW_NAMES.searchingValues);
    const langVisibility = getPrevVisibility(legendData);
    setSelectedVisibility(chartData, langVisibility);
    setMaxY();
  } else if (x > 90 && x < 160 && y > 35 && y < 55) {
    description.textContent =
      "Some duels between programming languages (searching).";
    setView(VIEW_NAMES.searchingDuels);
    setAllVisibility(chartData, false);
    const index = duels.getDuelIndex();
    setDuelsVisibility(duels, chartData, index);
    setMaxY();
  } else if (x > 0 && x < 70 && y > 95 && y < 115) {
    description.textContent =
      "The usage popularity of some programming languages.";
    setView(VIEW_NAMES.usageValues);
    const langVisibility = getPrevVisibility(legendData2);
    setSelectedVisibility(chartData2, langVisibility);
    setMaxY2();
  } else if (x > 90 && x < 160 && y > 95 && y < 115) {
    description.textContent =
      "Some duels between programming languages (usage).";
    setView(VIEW_NAMES.usageDuels);
    setAllVisibility(chartData2, false);
    const index = duels.getDuelIndex();
    setDuelsVisibility(duels, chartData2, index);
    setMaxY2();
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
  draw,
  setView,
  view,
  duels,
  chartData2
) => {
  const { getChartData, getLegendData, setMaxY } = chartData;
  const { getChartData2, getLegendData2, setMaxY2 } = chartData2;

  if (offsetY < LEGEND_Y) {
    handleLegendMenuClick(
      offsetX,
      offsetY,
      setView,
      getChartData(),
      getChartData2(),
      duels,
      setMaxY,
      setMaxY2,
      getLegendData(),
      getLegendData2()
    );
  } else {
    if (view() === VIEW_NAMES.searchingValues) {
      handleLegendClick(
        offsetX,
        offsetY,
        getChartData(),
        getLegendData(),
        setMaxY
      );
    } else if (view() === VIEW_NAMES.searchingDuels) {
      handleDuelsClick(offsetX, offsetY, getChartData(), setMaxY, duels);
    } else if (view() === VIEW_NAMES.usageValues) {
      handleLegendClick(
        offsetX,
        offsetY,
        getChartData2(),
        getLegendData2(),
        setMaxY2
      );
    } else if (view() === VIEW_NAMES.usageDuels) {
      handleDuelsClick(offsetX, offsetY, getChartData2(), setMaxY2, duels);
    }
  }
  window.requestAnimationFrame(draw);
};

const eventHandler = (
  chartData,
  { draw, setView, view },
  duels,
  chartData2
) => {
  canvas2.addEventListener(
    "click",
    (e) => handleEvent(e, chartData, draw, setView, view, duels, chartData2),
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
  canvas1.addEventListener(
    "mousemove",
    (e) => handleMouseMove(e, view, draw, chartData, chartData2),
    false
  );
};

export default eventHandler;
