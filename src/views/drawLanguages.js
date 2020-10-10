import { getLanguageColor, scaleX, scaleY } from "../drawing";
import { countIndex } from "../models/dataParsing";

const drawLanguageLine = (ctx, x1, y1, x2, y2, color) => {
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
};

const drawLanguage = (ctx, language, maxY, maxX, minTime, dt) => {
  const color = getLanguageColor(language[0].language);
  language.forEach((record, i) => {
    const t1 = countIndex(record.date, minTime, dt);
    const x1 = scaleX(ctx, t1, maxX);
    const y1 = scaleY(ctx, record.value, maxY);
    if (i > 0) {
      const t2 = countIndex(language[i - 1].date, minTime, dt);
      const x2 = scaleX(ctx, t2, maxX);
      const y2 = scaleY(ctx, language[i - 1].value, maxY);
      drawLanguageLine(ctx, x1, y1, x2, y2, color);
    }
  });
};

const drawLanguagesLines = (ctx, chartData, maxY, { minTime, maxX, dt }) => {
  chartData.forEach((language) => {
    if (language.length && language[0].visibility)
      drawLanguage(ctx, language, maxY, maxX, minTime, dt);
  });
};

export default drawLanguagesLines;
