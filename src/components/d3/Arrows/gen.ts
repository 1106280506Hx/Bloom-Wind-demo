import * as d3 from "d3";
import users from "@/assets/json/all_accounts.json"

interface Point {
  x: number;
  y: number;
  color: string;
  label: string;
  from: string;
}

interface Options {
  /**容器宽 */
  width: number;
  /**容器高 */
  height: number;
  /**容器id */
  id: string;
  /**数据 */
  data: any[];
  /**箭头大小 */
  arrowSize: number;
  /**线段大小 */
  lineSize: number;
  /**点击事件 */
  clickHandler: (data: any) => void;
}

export default function (options: Options) {
  const { id, toolTipId, width, height, lineSize, arrowSize, data, clickHandler } =
    options;

  // Clear previous contents to avoid duplication
  d3.select(id).selectAll("*").remove();
  // Select the SVG container
  const svg = d3.select(id).attr("width", width).attr("height", height);

  // Create a tooltip div and hide it by default
  const tooltip = d3
    .select(toolTipId)
    .style("opacity", 0);

  // Draw the arrows
  svg
    .selectAll(".arrow")
    .data(data)
    .enter()
    .append("polyline")
    .attr("class", "arrow")
    .attr("points", d => d.path.map(point => `${point.x},${point.y}`).join(" "))
    .attr("marker-end", (d, i) => `url(#arrowhead-${i})`) // Assign unique marker id
    .style("stroke-width", d => {
      const dataLength = Object.values(d.path[0].value).flat(2).length;
      return dataLength / 80 < 5 ? lineSize : dataLength / 80;
    }) // Set initial line width
    .style("stroke", d => d.path[0].color) // Set line color
    .style("fill", "none")
    .on("mouseover", function (event, d) {
      // Show the tooltip
      tooltip.transition().duration(200).style("opacity", 1);
      // 目标箭头最早的一片文章
      const lastData = d.path[0].value[d.path[0].label].sort((a, b) => a.timer - b.timer)[0];
      tooltip
        .html(
          `
            <div style="width: 400px; color: #444; padding: 10px 8px;">
              <div style="display: flex;">
                <img src="${lastData.avatar}" referrerpolicy="no-referrer" style="width: 60px; height: 60px"></img>
                <div style="flex: 1; margin-left: 8px; display: flex; flex-direction: column; justify-content: center;">
                  <div style="font-size: 20px">${lastData.name}</div>
                  <div>粉丝：<span>${users.find(item => item.name === lastData.name)?.fan || 0}</span></div>
                </div>
              </div>
              <div style="width: 100%; height: 1px; background: #eaeaea; margin: 6px 0"></div>
              <div style="padding: 0 12px">
                <p style="font-size: 16px">Post:</p>
                <p>${lastData.publish_time}</p>
                <p style="line-height: 1.25; text-indent: 2em; display: -webkit-box; overflow: hidden; text-overflow: ellipsis; word-break: break-all; -webkit-box-orient: vertical; -webkit-line-clamp: 12;">${lastData.text}</p>

                <div style="width: 100%; height: 1px; background: #eaeaea; margin: 6px 0"></div>
                <div>
                  <p>点赞：${lastData.cnt_agree}</p>
                  <p>评论：${lastData.cnt_comment}</p>
                  <p>分享：${lastData.cnt_retweet}</p>
                </div>
              </div>
            </div>
          `
        ) // Set tooltip content
        .style("left", event.pageX + 50 + "px")
        .style("top", event.pageY - 50 + "px")
        .style("border", `1px solid ${d.path[0].color}`)
        ;

      // Increase line width on hover
      const dataLength = Object.values(d.path[0].value).flat(2).length;
      d3.select(this).style("stroke-width", dataLength / 80 < 5 ? lineSize : dataLength / 80 * 2);
    })
    .on("mouseout", function (event, d) {
      // Hide the tooltip
      tooltip.transition().duration(500).style("opacity", 0);

      // Reset line width
      const dataLength = Object.values(d.path[0].value).flat(2).length;
      d3.select(this).style("stroke-width", dataLength / 80 < 5 ? lineSize : dataLength / 80);
    })
    .on("click", function (event, d) {
      // Handle click event
      tooltip.transition().duration(500).style("opacity", 0);
      clickHandler && clickHandler(d);
    });

  // Define arrowhead markers for each polyline
  svg
    .selectAll("defs")
    .data(data)
    .enter()
    .append("defs")
    .append("marker")
    .attr("id", (d, i) => `arrowhead-${i}`) // Unique ID for each arrow
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", arrowSize)
    .attr("markerHeight", arrowSize)
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", d => d.path[0].color) // Use dynamic color
    .style("stroke", "none");
}


