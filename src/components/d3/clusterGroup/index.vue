<template>
  <div class="group-content">
    <div class="item" id="groupContentLeft">
      <div v-for="(value, key) in data.zhihu">
        <RadialStackedBar
          :data="value"
          :title="key"
          :key="key"
          :size="cSize"
          :colors1="['#6AB6F5']"
          :colors2="['#A7E3FD']"
          @sectorClick="sectorClickHandler"
          @bubbleClick="bubbleClickHandler"
        ></RadialStackedBar>
      </div>
    </div>
    <div class="item" id="groupContentRight">
      <div v-for="(value, key) in data.weibo">
        <RadialStackedBar
          :data="value"
          :title="key"
          :key="key"
          :size="cSize"
          :colors1="['#FE9F64']"
          :colors2="['#FFCE8B']"
          @sectorClick="sectorClickHandler"
          @bubbleClick="bubbleClickHandler"
        ></RadialStackedBar>
      </div>
    </div>
    <Arrows :data="ArrowsData" @click="arrowsClickHandler"></Arrows>
  </div>
</template>

<script setup lang="ts">
  import Arrows from "@/components/d3/Arrows/index.vue";
  import RadialStackedBar from "@/components/d3/RadialStackedBar/index.vue";

  const emit = defineEmits(["sectorClick", "arrowsClick", "bubbleClick"]);
  const props = defineProps({
    data: Array
  });

  const sectorClickHandler = evt => {
    emit("sectorClick", evt);
  };

  const bubbleClickHandler = evt => {
    emit("bubbleClick", evt);
  };

  const arrowsClickHandler = evt => {
    emit("arrowsClick", evt);
  };

  // cluder大小
  const cSize = 150;
  const ArrowsData = ref([]);
  const positionData = reactive<any>({
    weibo: [],
    zhihu: []
  });

  watch(
    () => props.data,
    value => {
      ArrowsData.value = [];
      positionData.weibo = [];
      positionData.zhihu = [];
      if (
        !Object.values(value.zhihu).length ||
        !Object.values(value.weibo).length
      ) {
        return;
      }
      setTimeout(() => {
        positionData.zhihu = hexagonalLayout("#groupContentLeft", 200, "zhihu");
        positionData.weibo = hexagonalLayout(
          "#groupContentRight",
          200,
          "weibo"
        );
      });
    },
    { deep: true, immediate: true }
  );

  watch(
    () => positionData,
    value => {
      ArrowsData.value = [];
      value.zhihu.forEach((zh, index) => {
        const wb = value.weibo.find(wb => zh.label === wb.label);
        if (wb) {
          const dataf = ArrowsData.value.find(
            item =>
              item?.path[0]?.label === zh.label ||
              item?.path[1]?.label === wb.label
          );

          const RandomNumber = Math.random();
          const flag = index % 2 === 0;
          const path = (() => {
            const data = [];
            data.push({
              ...zh,
              x: flag ? zh.x + cSize / 2 + 60 : zh.x + cSize / 2 + 20,
              y: zh.y + cSize / 4,
              color: "#A7E3FD"
            });
            // 定点
            const label = data[0].label;
            if (label === "问界回应") {
              data.push(
                {
                  x: 750,
                  y: data[0].y
                },
                {
                  x: 800,
                  y: data[0].y + 110
                },
                {
                  x: 950,
                  y: data[0].y + 110
                },
                {
                  x: 1000,
                  y: data[0].y
                }
              );
            } else if (label === "家属发声") {
              data.push(
                {
                  x: 500,
                  y: data[0].y
                },
                {
                  x: 550,
                  y: data[0].y + 100
                },
                {
                  x: 720,
                  y: data[0].y + 100
                },
                {
                  x: 770,
                  y: data[0].y + 200
                },
                {
                  x: 950,
                  y: data[0].y + 200
                },
                {
                  x: 1000,
                  y: data[0].y + 100
                },
                {
                  x: 1170,
                  y: data[0].y + 100
                },
                {
                  x: 1220,
                  y: data[0].y
                }
              );
            } else if (label === "四大疑问_说明") {
              data.push(
                {
                  x: 500,
                  y: data[0].y
                },
                {
                  x: 550,
                  y: data[0].y - 100
                },
                {
                  x: 720,
                  y: data[0].y - 100
                },
                {
                  x: 770,
                  y: data[0].y
                },
                {
                  x: 950,
                  y: data[0].y
                },
                {
                  x: 1000,
                  y: data[0].y - 100
                },
                {
                  x: 1170,
                  y: data[0].y - 100
                },
                {
                  x: 1220,
                  y: data[0].y
                }
              );
            } else if (label === "事故") {
              data.push(
                {
                  x: 720,
                  y: data[0].y
                },
                {
                  x: 770,
                  y: data[0].y - 100
                },
                {
                  x: 950,
                  y: data[0].y - 100
                },
                {
                  x: 1000,
                  y: data[0].y
                },
              );
            }

            data.push({
              ...wb,
              x: flag ? wb.x - cSize / 4 + 20 : wb.x - cSize / 4 - 20,
              y: wb.y + cSize / 4,
              color: "#FFCE8B"
            });
            return data.sort((a, b) => (flag ? -1 : 1));
          })();

          !dataf &&
            ArrowsData.value.push({
              path: path,
              data: {
                weibo: wb,
                zhihu: zh
              }
            });
        }
      });
    },
    { deep: true, immediate: true }
  );

  function hexagonalLayout(
    parentElementTarget: string,
    radius: number, // 半径
    key: string
  ) {
    const parentElement = document.querySelector(
      parentElementTarget
    )! as HTMLElement;
    const children = parentElement.children;
    const centerX = parentElement.offsetWidth / 2;
    const centerY = parentElement.offsetHeight / 2 + 270;

    const coordinates = [];

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const xPos = centerX + radius * Math.cos(angle);
      const yPos = centerY + radius * Math.sin(angle);

      const child = children[i] as HTMLElement;
      if (child) {
        // Set the position
        child.style.left = `${xPos - child.offsetWidth / 2}px`;
        child.style.top = `${yPos - child.offsetHeight / 2}px`;

        // Store the coordinates
        const rect = child.getBoundingClientRect();
        coordinates.push({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          label: child.querySelector(".chart-label")?.textContent,
          from: key,
          value: props.data[key]
        });
      }
    }

    return coordinates;
  }
</script>

<style scoped lang="scss">
  .group-content {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    .item {
      width: 50%;
      height: 100%;
      position: relative;
      z-index: 1;
      > * {
        position: absolute;
        display: inline-block;
      }
    }
  }
</style>
