const getDates = (data) =>
  data
    .map((monthlyData) => ({
      month: Number.parseInt(monthlyData.date.split("-")[1], 10),
      year: Number.parseInt(monthlyData.date.split("-")[0], 10),
    }))
    .reverse();

export default getDates;
