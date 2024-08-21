import * as d3 from "d3";
export interface onBrushEndReturns {
  startDate: Date;
  endDate: Date;
  data: any[];
}

interface Options {
  /** 容器宽度 */
  width: number;
  /** 容器高度 */
  height: number;
  /** tooltipId */
  toolTipId: string;
  /** 容器id */
  id: string;
  /** 数据 */
  data: any[][];
  /** 颜色集 */
  colors: string[];
  /**是否启用滑动选择 */
  isBrush: boolean;
  /** 滑动选择回调函数 */
  onBrushEnd?: (event: onBrushEndReturns) => void;
}

export default function (options: Options) {
  const {
    id,
    toolTipId,
    width: svgWidth,
    height: svgHeight,
    data: dataSets,
    colors,
    isBrush = false,
    onBrushEnd
  } = options;

  // 选择 SVG 元素
  const svg = d3.select(id).attr("width", svgWidth).attr("height", svgHeight);

  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  // 创建比例尺
  const x = d3.scaleTime().rangeRound([0, width]);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  // 创建坐标轴
  const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")).ticks(d3.timeDay.every(1)); // 设置 X 轴刻度为每天
  const yAxis = d3.axisLeft(y).ticks(5); // 设置 Y 轴刻度为 5

  // 创建折线生成器
  const line = d3
    .line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.value));

  // 扁平化数据以获取域
  const allData = dataSets.flat();
  x.domain(d3.extent(allData, (d: any) => d.date) as [Date, Date]);
  y.domain([0, d3.max(allData, (d: any) => d.value) as number]);

  // 绘制 X 轴
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},${height + margin.top})`)
    .call(xAxis);

  // 绘制 Y 轴
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(yAxis);

  // 绘制网格线
  function drawGridLines() {
    const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat('' as any).ticks(d3.timeDay.every(1));
    const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat('' as any).ticks(5); // 与 Y 轴刻度对齐

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},${height + margin.top})`)
      .call(xAxisGrid)
      .selectAll("line")
      .style("stroke-dasharray", "4 4"); // 设置虚线样式

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(yAxisGrid)
      .selectAll("line")
      .style("stroke-dasharray", "4 4"); // 设置虚线样式
  }

  drawGridLines();

  // 折线绘制函数
  function drawLine(data: any[], color: string) {
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .style("stroke", color)
      .style("fill", "none") // 确保没有填充色
      .style("stroke-width", 2); // 设置折线宽度
  }

  // 绘制所有折线
  dataSets.forEach((data, index) => drawLine(data, colors[index]));

  // 添加圆点
  function addCircles(data: any[], color: string) {
    svg
      .selectAll(`.circle-${color}`)
      .data(data)
      .enter()
      .append("circle")
      .attr("class", `circle circle-${color}`)
      .attr("cx", (d: any) => x(d.date))
      .attr("cy", (d: any) => y(d.value))
      .attr("r", 4) // 圆圈半径
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .style("stroke", color) // 圆圈描边颜色
      .style("fill", "white"); // 圆圈填充颜色
  }

  // 添加所有圆点
  dataSets.forEach((data, index) => addCircles(data, colors[index]));

  // 创建 Tooltip
  const tooltip = d3.select(toolTipId);

  // 创建虚线
  const verticalLine = svg
    .append("line")
    .attr("class", "vertical-line")
    .attr("y1", 0)
    .attr("y2", height)
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("transform", `translate(${margin.left - 50},${margin.top})`)
    .style("stroke", "black") // 设置虚线颜色
    .style("stroke-dasharray", "4") // 设置虚线样式
    .style("opacity", 0);

  // 鼠标移动事件
  svg
    .on("mousemove", function (event) {
      const [mouseX] = d3.pointer(event);
      const date: any = x.invert(mouseX);

      // 找到最近的数据点
      const closestData = allData.reduce((prev, curr) => {
        return Math.abs(curr.date - date) < Math.abs(prev.date - date)
          ? curr
          : prev;
      });
      // 更新 tooltip 内容
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(`贴数: ${closestData.value}<br>时间: ${closestData.formatDate}`)
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 28 + "px");

      // 更新虚线位置
      verticalLine
        .attr("x1", x(closestData.date) + margin.left)
        .attr("x2", x(closestData.date) + margin.left)
        .style("opacity", 1);
    })
    .on("mouseleave", function () {
      tooltip.transition().duration(500).style("opacity", 0);
      verticalLine.style("opacity", 0);
    });

  if (isBrush) {
    // 创建刷子（brush）
    const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height]
    ])
    .on("end", brushed);

    // 添加刷子
    svg
      .append("g")
      .attr("class", "brush")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(brush);

    // 当用户完成刷子操作时调用的函数
    function brushed(event: any) {
      const selection = event.selection;
      if (selection) {
        const [x0, x1] = selection;
        const startDate = x.invert(x0);
        const endDate = x.invert(x1);
        if (onBrushEnd) {
          const filterData = dataSets.reduce(
            (array, item, index) => {
              const fil = item.filter((f: any) => {
                return f.dateNow > startDate && f.dateNow < endDate;
              });
              array[index] = fil;
              return array;
            },
            [[], []]
          );
          onBrushEnd({
            startDate,
            endDate,
            data: filterData,
            flatData: filterData.reduce((array, item, index) => {
              item.forEach((f: any) => array[index].push(...f.children))
              return array;
            }, [[], []])
          } as onBrushEndReturns);
        }
      }
    }
  }
}
