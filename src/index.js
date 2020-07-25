import "./styles.scss";
import { drawing } from "./drawing";
import { data } from "./models/data";
import { parseData, parseLegendData } from "./models/dataParsing";
import getDates from "./models/getDates";
import eventHandler from "./eventHandler";

(function () {
  const chartData = parseData(data);
  const dates = getDates(data);
  const legendData = parseLegendData(chartData);
  const draw = () => drawing(chartData, dates, legendData);
  window.requestAnimationFrame(draw);
  eventHandler(chartData, legendData, draw);
})();
