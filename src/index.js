import "./styles.scss";
import { dataset1 } from "./models/dataset1";
import { parseData } from "./models/dataParsing";
import { createView } from "./drawing";
import eventHandler from "./eventHandler";

(function () {
  const chartData = parseData(dataset1);
  const View = createView(chartData);
  window.requestAnimationFrame(View.draw);
  eventHandler(chartData, View);
})();
