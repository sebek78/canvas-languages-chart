import "./styles.scss";
import { dataset1 } from "./models/dataset1";
import { dataset2 } from "./models/dataset2";
import { parseData } from "./models/dataParsing";
import { createView } from "./drawing";
import eventHandler from "./eventHandler";
import { createDuels } from "./models/duels";

(function () {
  const chartData = parseData(dataset1, 1);
  const chartData2 = parseData(dataset2, 2);
  const Duels = createDuels();
  const View = createView(chartData, Duels, chartData2);
  window.requestAnimationFrame(View.draw);
  eventHandler(chartData, View, Duels, chartData2);
})();
