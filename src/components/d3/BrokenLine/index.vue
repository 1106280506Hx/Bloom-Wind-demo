<template>
  <div class="broken-line">
    <svg :id="'BrokenLineSvg' + id"></svg>
    <div class="tooltip" :id="'b-tooltip' + id"></div>
  </div>
</template>

<script setup lang="ts">
  import useCanvas from "./gen";
  import type { onBrushEndReturns } from "./gen";
  type dataPropType = [any[], any[]];
  const emit = defineEmits<{
    (e: "select", data: onBrushEndReturns): void;
  }>();
  const props = defineProps({
    data: {
      type: Array,
      default: () => [[], []],
      require: true
    } as unknown as PropType<dataPropType>,
    isBrush: {
      type: Boolean,
      default: false
    }
  });

  const id = Math.random().toString(16).slice(8);
  onMounted(() => {
    useCanvas({
      id: "#BrokenLineSvg" + id,
      toolTipId: "#b-tooltip" + id,
      width: window.innerWidth - 100,
      height: window.innerHeight * 0.2,
      data: props.data!,
      colors: ["orange", "blue"],
      isBrush: props.isBrush,
      onBrushEnd: event => {
        emit("select", event);
      }
    });
  });
</script>

<style lang="scss" scoped>
  .broken-line {
    position: relative;
    svg {
      font: 15px sans-serif;
    }

    .axis path,
    .axis line {
      fill: none;
      shape-rendering: crispEdges;
    }

    .line {
      fill: none;
      stroke-width: 2px;
    }

    .circle {
      fill: white;
      /* 实心圆圈的填充颜色 */
      stroke-width: 2px;
      /* 描边宽度 */
    }

    .tooltip {
      position: fixed;
      text-align: center;
      width: 120px;
      padding: 5px;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border-radius: 4px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .vertical-line {
      stroke: gray;
      stroke-width: 1px;
      stroke-dasharray: 4;
    }

    .grid line {
      stroke: lightgrey;
      stroke-opacity: 0.7;
      shape-rendering: crispEdges;
    }

    .grid path {
      stroke-width: 0;
    }
  }
</style>
