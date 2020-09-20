import { getLanguageColor, scaleX, scaleY } from "../drawing";

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

const drawLanguage = (ctx, language, maxY, maxX) => {
  const color = getLanguageColor(language[0].language);
  language.forEach((record, i) => {
    const x1 = scaleX(ctx, i, maxX);
    const y1 = scaleY(ctx, record.value, maxY);
    if (i > 0) {
      const x2 = scaleX(ctx, i - 1, maxX);
      const y2 = scaleY(ctx, language[i - 1].value, maxY);
      drawLanguageLine(ctx, x1, y1, x2, y2, color);
    }
  });
};

const drawLanguagesLines = (ctx, chartData, maxY) => {
  chartData.forEach((language) => {
    if (language[0].visibility)
      drawLanguage(ctx, language, maxY, language.length);
  });
};

export default drawLanguagesLines;
