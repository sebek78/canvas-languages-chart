import "./styles.scss";
import { dataset1 } from "./models/dataset1";
import { parseData } from "./models/dataParsing";
import { createView } from "./drawing";
import eventHandler from "./eventHandler";
import { createDuels } from "./models/duels";

(function () {
  const chartData = parseData(dataset1);
  const Duels = createDuels();
  const View = createView(chartData, Duels);
  window.requestAnimationFrame(View.draw);
  eventHandler(chartData, View, Duels);
})();
