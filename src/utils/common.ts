import dayjs from "dayjs";
export const useTimeLineData = data => {
  const postsMapToDayLine = data.reduce(
    (array: any, item: any) => {
      const fromType = item.from === "weibo" ? 0 : 1;
      const formatDayDate = (dayjs(item.publish_time) as any).$d;
      const checkDayDate = array[fromType].find(
        (item: any) => item.dateNow === formatDayDate.setHours(0, 0, 0, 0)
      );
      if (!checkDayDate) {
        array[fromType].push({
          date: formatDayDate,
          dateNow: formatDayDate.setHours(0, 0, 0, 0),
          formatDate: dayjs(formatDayDate).format("YYYY-MM-DD"),
          value: 1,
          children: [item]
        });
      } else {
        checkDayDate.value++;
        checkDayDate.children = [...checkDayDate.children, item];
      }
      return array;
    },
    [[], []]
  ) as [any[], any[]];

  const sd = +(dayjs("2024-04-26") as any).$d;
  const ed = +(dayjs("2024-05-13") as any).$d;
  postsMapToDayLine[0] = postsMapToDayLine[0].filter(
    i => i.dateNow > sd && i.dateNow < ed
  );
  postsMapToDayLine[1] = postsMapToDayLine[1].filter(
    i => i.dateNow > sd && i.dateNow < ed
  );
  postsMapToDayLine[0].sort((a, b) => a.dateNow - b.dateNow);
  postsMapToDayLine[1].sort((a, b) => a.dateNow - b.dateNow);
  return postsMapToDayLine;
};
