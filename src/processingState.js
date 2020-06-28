export const processingState = (state, action) => {
  let stateCopy = Object.assign({}, state);
  stateCopy = calcFPS(stateCopy);
  if (action && Object.keys(action).length !== 0) {
    switch (action.type) {
      case "RUN":
        break;
    }
  }
  return stateCopy;
};

const calcFPS = (state) => {
  const time = Date.now();
  return time - state.start > 1000
    ? { ...state, fps: state.frames, frames: 0, start: time }
    : { ...state, frames: state.frames + 1 };
};
