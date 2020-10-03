const clearCanvas = (ctx) =>
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

const drawChartBackground = (ctx) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const drawCanvas = (ctx) => {
  clearCanvas(ctx);
  drawChartBackground(ctx);
};

export default drawCanvas;
