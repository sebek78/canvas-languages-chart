import { WIDTH, HEIGHT, MENU_HEIGHT } from "./constants";

export default function drawing(ctx, state) {
  clearCanvas(ctx);
  drawMenu(ctx);
  drawChartBackground(ctx);
  drawFPS(ctx, state.fps);
}

const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
};

const drawMenu = (ctx) => {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, WIDTH, 29);
};

const drawChartBackground = (ctx) => {
  ctx.fillStyle = "#CCC";
  ctx.fillRect(0, MENU_HEIGHT, WIDTH, HEIGHT);
};

function drawFPS(ctx, fps) {
  ctx.fillStyle = "lightblue";
  ctx.fillText(`FPS: ${fps}`, 10, 15);
}
