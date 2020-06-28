import {
  HEIGHT,
  BOTTOM_PADDING,
  MAX_Y_CHART_VALUE,
  TOP_PADDING,
  LEFT_PADDING,
  X_UNIT,
  LANGUAGES,
} from "./constants";

const relativeY = (HEIGHT - TOP_PADDING - BOTTOM_PADDING) / MAX_Y_CHART_VALUE;

export const scaleY = (value) =>
  HEIGHT - BOTTOM_PADDING - Number.parseInt(value * relativeY, 10);

export const scaleX = (index) => LEFT_PADDING + X_UNIT * index;

export const getLanguageColor = (language) =>
  LANGUAGES.find((lang) => lang.name === language).color;
