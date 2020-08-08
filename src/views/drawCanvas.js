import { WIDTH, HEIGHT, MENU_HEIGHT } from "../constants";

const clearCanvas = (ctx) => ctx.clearRect(0, 0, WIDTH, HEIGHT);

const drawMenu = (ctx) => {
  ctx.fillStyle = "#212121";
  ctx.fillRect(0, 0, WIDTH, MENU_HEIGHT);
};

const drawChartBackground = (ctx) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, MENU_HEIGHT, WIDTH, HEIGHT);
};

const drawCanvas = (ctx) => {
  clearCanvas(ctx);
  drawMenu(ctx);
  drawChartBackground(ctx);
};

export default drawCanvas;
