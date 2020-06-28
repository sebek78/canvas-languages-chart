import { MENU_HEIGHT } from "./constants";

export const handleEvent = ({ offsetX, offsetY }) => {
  if (offsetY < MENU_HEIGHT) {
    if (offsetX >= 100 && offsetX <= 150) {
      return {
        type: "RUN",
      };
    }
  }
};
