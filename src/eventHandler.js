import { canvas } from "./drawing";

const handleEvent = ({ offsetX, offsetY }, draw) => {
  console.log("click", offsetX, offsetY);
  window.requestAnimationFrame(draw);
};

const eventHandler = (data, draw) => {
  canvas.addEventListener("click", (e) => handleEvent(e, draw), false);
};

export default eventHandler;
