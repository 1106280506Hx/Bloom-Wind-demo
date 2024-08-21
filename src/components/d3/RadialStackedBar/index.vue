<template>
  <div class="chart-container">
    <svg :id="'radialStackedBarChart' + id"></svg>
    <div class="chart-label">{{ title }}</div>
  </div>
  <div class="tooltip" :id="'tooltip' + id"></div>
</template>

<script setup lang="ts">
  import useCanvas from "./gen";

  const emit = defineEmits(["sectorClick", "bubbleClick"]);
  const props = defineProps({
    size: {
      type: Number,
      default: 200
    },
    data: {
      type: Array,
      default: () => {}
    },
    title: {
      type: String,
      default: ""
    },
    colors1: {
      type: Array
    },
    colors2: {
      type: Array
    }
  });

  const id = Math.random().toString(16).slice(-8);
  watch(
    () => props.data,
    value => {
      nextTick(() => {
        useCanvas({
          size: props.size,
          innerRadius: props.size * 0.3,
          toolTipId: "#tooltip" + id,
          id: "#radialStackedBarChart" + id,
          data: value,
          colors1: props.colors1,
          colors2: props.colors2,
          sectorClick: event => {
            emit("sectorClick", event);
          },
          bubbleClick: event => {
            emit("bubbleClick", event);
          }
        });
      });
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

<style scoped>
  .tooltip {
    position: fixed;
    z-index: 99;
    background-color: white;
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 5px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .chart-label {
    text-align: center;
  }
</style>
