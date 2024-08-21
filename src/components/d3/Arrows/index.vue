<template>
  <svg :id="'arrowsTo' + id" class="arrows-to"></svg>
  <div :id="'arrowsToTooltip' + id" class="arrows-tooltip"></div>
</template>

<script setup lang="ts">
  import useCanvas from "./gen";

  const emit = defineEmits(["click"]);
  const props = defineProps({
    width: {
      type: Number,
      default: window.innerWidth - 100
    },
    height: {
      type: Number,
      default: window.innerHeight - 100
    },
    data: {
      type: Array,
      default: () => []
    }
  });

  const id = Math.random().toString(16).slice(-8);
  watch(
    () => props.data,
    value => {
      nextTick(() => {
        // const lineSize = Math.random() * 8 + 1;
        const lineSize = 5;
        useCanvas({
          id: "#arrowsTo" + id,
          toolTipId: "#arrowsToTooltip" + id,
          width: props.width,
          height: props.height,
          data: value,
          arrowSize: lineSize,
          lineSize: lineSize,
          clickHandler: data => {
            emit("click", data);
          }
        });
      });
    },
    { immediate: true, deep: true }
  );
</script>

<style lang="scss" scoped>
  .arrows-to {
    position: absolute;
  }
  .arrows-tooltip {
    position: fixed;
    background-color: #f9f9f9;
    border: 1px solid #d3d3d3;
    padding: 8px;
    border-radius: 4px;
    pointer-events: none;
    font-size: 14px;
    color: #333;
    z-index: 9;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
</style>
