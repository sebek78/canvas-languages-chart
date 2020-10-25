export const createDuels = () => {
  let config = [
    {
      name: "Frontend",
      languages: ["JavaScript", "TypeScript", "Dart"],
      visibility: true,
    },
    {
      name: "Backend",
      languages: ["PHP", "Go", "Ruby", "Python"],
      visibility: false,
    },
    {
      name: "Desktop",
      languages: ["Java", "C#", "Kotlin"],
      visibility: false,
    },
    {
      name: "System",
      languages: ["C", "C++", "Rust"],
      visibility: false,
    },
  ];
  return {
    getConfig: () => config,
    getDuelIndex: () => config.findIndex((el) => el.visibility),
    setAllInvisible: () => {
      config = config.map((element) => ({ ...element, visibility: false }));
    },
    setVisible: (id) => {
      if (id >= 0) config[id].visibility = true;
    },
  };
};
