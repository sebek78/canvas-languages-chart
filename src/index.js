import "./styles.scss";
import { handleEvent } from "./eventHandler";
import { processingState } from "./processingState";
import drawing from "./drawing";
import { createState } from "./init.js";

(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = "16px sans-serif";
  ctx.textBaseline = "middle";

  let state = createState();
  let action = {};

  const loop = () => {
    state = processingState(state, action);
    action = {};
    drawing(ctx, state);
    window.requestAnimationFrame(loop);
  };

  canvas.addEventListener("click", (e) => (action = handleEvent(e)), false);
  window.requestAnimationFrame(loop);
})();
