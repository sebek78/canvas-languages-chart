import "./styles.scss";
import { drawing } from "./drawing";
import { data } from "./models/data";
import { parseData } from "./models/dataParsing";
import getDates from "./models/getDates";
import eventHandler from "./eventHandler";

(function () {
  const chartData = parseData(data);
  const dates = getDates(data);
  const draw = () => drawing(chartData, dates);
  window.requestAnimationFrame(draw);
  eventHandler(chartData, draw);
})();
