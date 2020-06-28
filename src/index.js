import "./styles.scss";
// import { handleEvent } from "./eventHandler";
import { processingState } from "./processingState";
import { createCtx, drawing } from "./drawing";
import { createState } from "./init.js";

import { data } from "./data";
import { parseData } from "./dataParsing";

(function () {
  const chartData = parseData(data);
  const ctx = createCtx();

  let state = createState();
  let action = {};

  const loop = () => {
    state = processingState(state, action);
    action = {};
    drawing(ctx, state, chartData);
    //window.requestAnimationFrame(loop);
  };
  //canvas.addEventListener("click", (e) => (action = handleEvent(e)), false);
  window.requestAnimationFrame(loop);
})();
