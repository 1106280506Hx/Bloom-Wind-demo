import * as d3 from "d3";
import dayjs from "dayjs";
import { groupBy } from "lodash";
import users from "@/assets/json/all_accounts.json";

/** 可选项接口 */
interface Options {
  /** 容器大小 */
  size: number;
  /** 内圆半径 */
  innerRadius: number;
  /** tooltipId */
  toolTipId: string;
  /** 容器id */
  id: string;
  /** 数据 */
  data: any[];
  /**深色颜色组 */
  colors1?: any[];
  /**浅色颜色组 */
  colors2?: any[];
  /** 阈值 */
  threshold?: number;
  /**扇形区域点击回调 */
  sectorClick?: (data: any) => void;
  /**起泡区域点击回调 */
  bubbleClick?: (data: any) => void;
}

// 计算影响力 （分享 * 3 + 点赞 * 2 + 评论）
export function genSum(item) {
  return +item.cnt_retweet * 3 + +item.cnt_agree * 2 + +item.cnt_comment;
}

/**
 * 绘制玫瑰图
 */
export default function drawRoseChart({
  size,
  innerRadius,
  toolTipId,
  id,
  data: sourceData,
  colors1 = [
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56",
    "#d0743c",
    "#ff8c00"
  ],
  colors2 = [
    "#cfe2f3",
    "#d9d2e9",
    "#d5a6bd",
    "#d9d2e9",
    "#f4cccc",
    "#f9cb9c",
    "#ffe599"
  ],
  sectorClick,
  bubbleClick
}: Options) {
  if (!sourceData) {
    return;
  }
  d3.select(id).selectAll("*").remove();

  sourceData.forEach(item => {
    // 计算影响力
    item.sum = genSum(item);
    // 获取文章当天0点时间
    item.timer = +dayjs(item.publish_time).$d.setHours(0, 0, 0, 0);
  });

  // 计算阈值（按照平均 / 2）
  /* const threshold =
    sourceData.reduce((total, item) => {
      total += genSum(item);
      return total;
    }, 0) /
    sourceData.length /
    4; */
  const threshold = 500;

  // 按照时间分组，
  const groupData = groupBy(sourceData, item => item.timer);
  const groupDataLength = Object.keys(groupData).length;
  const groupItemAngle = 360 / groupDataLength;

  const data = (d => {
    let resolve = [];
    for (const key in d) {
      const tempData = d[key];
      const tempObject = { date: key, sumData: [0, 0], children: tempData };
      tempObject.sumData = tempData.reduce(
        (arr, item) => {
          // 大于阈值是影响力大的
          if (genSum(item) > threshold) {
            arr[0]++;
          } else {
            arr[1]++;
          }
          return arr;
        },
        [0, 0]
      );
      resolve.push(tempObject);
    }
    return resolve;
  })(groupData);

  const width = size;
  const height = size;
  const maxOuterRadius = size / 2; // 最大外半径为容器的一半

  // 定义颜色比例尺
  const colorInner = d3.scaleOrdinal().range(colors1);

  // 较浅的颜色比例尺用于外圈
  const colorOuter = d3.scaleOrdinal().range(colors2);

  // 小圆圈颜色比例尺
  const sentimentColor = d3
    .scaleOrdinal()
    .domain([-1, -0.5, 0.5, 1])
    .range(["#4B0082", "#9370DA", "#FFFACF", "#FFD903"]);

  // 创建饼图生成器
  const pie = d3
    .pie()
    .sort(null)
    .value(d => d.sumData.reduce((acc, val) => acc + val, 0)); // 计算每个扇形的总值

  // 创建SVG画布
  const svg = d3
    .select(id)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`) // 防止裁切
    .style("overflow", "visible")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // 创建tooltip
  const tooltip = d3.select(toolTipId);

  // 创建弧形组
  const g = svg
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  // 为每个数据对创建两个弧形，以叠加显示
  g.each(function (d, i) {
    let currentInnerRadius = innerRadius; // 开始时的内半径
    d.data.sumData.forEach((value, index) => {
      // 计算外半径
      let currentOuterRadius =
        currentInnerRadius +
        (Math.log(value + 1) / 3) * (maxOuterRadius - innerRadius);

      //   let currentOuterRadius;
      // if (value === 0) {
      //   currentOuterRadius = innerRadius;
      // } else {
      //   // 使用对数变换并进行缩放和位移调整
      //   currentOuterRadius = currentInnerRadius + (Math.log(value + 1)) * (maxOuterRadius - innerRadius) + 5;
      // }

      // // 确保 currentOuterRadius 在最小和最大范围内
      // currentOuterRadius = Math.max(Math.min(currentOuterRadius, maxOuterRadius), currentInnerRadius);

      // 创建弧形
      const arc = d3
        .arc()
        .innerRadius(currentInnerRadius)
        // 小于50时 设置50 避免值太小时不显示弧线
        .outerRadius(currentOuterRadius < 50 ? 52 : currentOuterRadius)
        .startAngle((d.index * groupItemAngle * Math.PI) / 180)
        .endAngle(((d.index + 1) * groupItemAngle * Math.PI) / 180);

      // 绘制路径
      d3.select(this)
        .append("path")
        .attr("d", arc)
        .attr("fill", index === 0 ? colorInner(i) : colorOuter(i)) // 内圈深色，外圈浅色
        .style("stroke", "#FFFFFF")
        .style("stroke-width", 2)
        .on("mouseover", function (event) {
          tooltip.transition().style("opacity", 1);
          tooltip
            .html(
              `时间: ${dayjs(+d.data.date).format("YYYY-MM-DD")}<br />${
                d.data.sumData[0] === value ? "有影响力" : "无影响力"
              }个数: ${value}`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", function () {
          tooltip.transition().style("opacity", 0);
        })
        .on("click", function (event) {
          sectorClick && sectorClick({ ...d.data, value });
        });

      // 更新内半径以叠加下一个部分
      currentInnerRadius = currentOuterRadius;
    });
  });

  // 创建泡泡图数据 (取前10分之一数据)
  const bubbleData = sourceData
    .slice(
      0,
      sourceData.length / 10 < 5
        ? 5
        : sourceData.length / 12 > 20
          ? 20
          : sourceData.length / 12
    )
    .map(d => ({
      sentiment_score: d.sentiment_score,
      // radius: 5 + Math.min(genSum(d) / 10, 20) // 根据影响力设置泡泡大小
      radius: 5
    }));

  // 创建泡泡布局
  d3.forceSimulation(bubbleData)
    .force("x", d3.forceX().strength(0.1))
    .force("y", d3.forceY().strength(0.1))
    .force(
      "collide",
      d3.forceCollide(d => d.radius + 1)
    )
    .on("tick", ticked);

  function ticked() {
    svg
      .selectAll(".bubble")
      .data(bubbleData)
      .join("circle")
      .attr("class", "bubble")
      .attr("r", d => d.radius)
      .attr("fill", d => sentimentColor(d.sentiment_score))
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .style("stroke", "#FFFFFF")
      .style("stroke-width", 2)
      .on("click", function () {
        bubbleClick && bubbleClick(sourceData);
      });
  }
  const arcData = (d => {
    const newData = [
      {
        category: "有影响力用户数",
        startAngle: -0.03,
        endAngle: 0,
        color: "tomato"
      },
      {
        category: "有影响力帖子数",
        startAngle: 0.03,
        endAngle: 0,
        color: "steelblue"
      }
    ];
    for (const item of d) {
      newData[0].endAngle += item.sumData[0];
      newData[1].endAngle += item.sumData[1];
    }
    // 有影响力的用户统计
    const userLength = (() => {
      // 粉丝大于500判断为有影响力用户
      let length = 0;
      const fansThreshold = 500;
      const postUsers = [...new Set(d.map(item => item.children).flat(2).map(item => item.name))]
      for (const iterator of postUsers) {
        +users.find(item => item.name === iterator)?.fan > fansThreshold && length++
      }
      return length
    })();

    const total = newData[0].endAngle + newData[1].endAngle;
    newData[0].category = `有影响力用户数：${userLength}`;
    newData[1].category = `有影响力帖子数：${newData[1].endAngle}`;
    newData[0].endAngle = -userLength / total;
    newData[1].endAngle = newData[1].endAngle / total;
    return newData;
  })(data);

  // 内圈弧形生成器
  const innerArc = d3
    .arc()
    .innerRadius(innerRadius - 5) // 设定内圈弧形的内半径
    .outerRadius(innerRadius - 1) // 设定内圈弧形的外半径
    .startAngle(d => d.startAngle) // 起始角度
    .endAngle(d => d.endAngle); // 结束角度

  // 添加内圈弧形
  svg
    .append("g")
    .attr("class", "inner-arcs")
    .selectAll("path")
    .data(arcData)
    .join("path")
    .attr("fill", d => d.color)
    .attr("d", innerArc)
    .on("mouseover", (event, d) => {
      tooltip.transition().style("opacity", 1);
      tooltip
        .html(`${d.category}`)
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mousemove", event => {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().style("opacity", 0);
    });
}
