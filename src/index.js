import "./styles.scss";
import { data } from "./models/data";
import { parseChartData } from "./models/dataParsing";
import { createView } from './drawing';
import eventHandler from "./eventHandler";

(function () {
  const chartData = parseChartData(data);
  const { draw } = createView(chartData);
  window.requestAnimationFrame(draw);
  eventHandler(chartData, draw);
})();
