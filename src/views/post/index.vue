<template>




  <div class="container">
    <!-- 控制条 -->
    <!-- <div class="slider-container">
      <input type="range" min="0" :max="connections.length" v-model="lineCount" class="slider" />
      <span class="slider-label">{{ connections.length-lineCount }} 条连线</span>
    </div> -->

    <div style="position: absolute;top:10px;left:40px;font-size: 20px;font-weight: bold;color: #333;">Bloom Wind</div>

    <div class="icon-container">
      <div class="icon-item">
        <div class="blue-square"></div>
        <ZhihuSquareFilled style="font-size:30px ;color:#2F96EB" />
      </div>
      <div class="icon-item">
        <div class="orange-square"></div>
        <WeiboSquareFilled style="font-size:30px ;color:orange" />
      </div>
    </div>

    <a-row class="controls">
      <a-col :span="20">
        <a-slider v-model:value="thresholdLevel" :min="0" :max="20" />
        <span class="label">阈值等级</span>
      </a-col>
      <a-col :span="4">
        <a-input-number v-model:value="thresholdLevel" :min="0" :max="20" style="margin-left: 16px" />
      </a-col>
    </a-row>

    <div>
      <a-switch v-model:checked="checked" style="top: 100px; left: 50px; z-index: 3; position: absolute;" />
      <div style="top: 100px; left: 100px; z-index: 3; position: absolute; color: black">关键帖子传播</div>
      <a-timeline pending="记录中..." v-if="checked" style="top: 150px; left: 50px; z-index: 3; position: absolute;">
        <a-timeline-item class="timeline-item">这件事有三个点需要去核实澄清... 2024-04-28 11:35:57</a-timeline-item>
        <a-timeline-item class="timeline-item">我和所有人的观点不一样... 2024-04-28 11:43:38</a-timeline-item>
        <a-timeline-item class="timeline-item">如何看待2024年4月26日下午问界M7高速车祸？ 2024-04-30 12:59:32</a-timeline-item>
        <a-timeline-item class="timeline-item">连续不断的反噬#问界m7起火# 2024-04-30 23:21:22</a-timeline-item>
      </a-timeline>
    </div>

    <!-- 引入 color-board -->
    <div class="color-board">
      <div class="label neg">NEG</div>
      <div class="square deep-purple">
        <div class="number">-1</div>
      </div>
      <div class="square light-purple">
        <div class="number">-0.5</div>
      </div>
      <div class="square light-yellow">
        <div class="number">0.5</div>
      </div>
      <div class="square deep-yellow">
        <div class="number">1</div>
      </div>
      <div class="label pos">POS</div>
    </div>



    <!-- 引入卡片弹窗 -->
    <a-modal v-model:visible="isCardVisible" title="帖子详情" @cancel="isCardVisible = false" footer="">
      <div class="post-card">
        <div class="header">
          <img class="avatar" :src="selectedPost.avatar" alt="头像"
            style="width: 50px; height: 50px; border-radius: 50%;">
          <div class="user-info">
            <div class="username">{{ selectedPost.username }}</div>
            <div class="followers">粉丝数: {{ selectedPost.followers }}</div>
          </div>
        </div>
        <hr class="divider">
        <div class="content">
          <div v-if="selectedPost.from === 'zhihu'" class="query" style="font-weight: bold;font-size: large;">
            知乎提问: {{ selectedPost.query }}
          </div>
          <div class="date">日期: {{ selectedPost.date }}</div>
          <div class="text">帖子内容: {{ selectedPost.content }}</div>
        </div>
        <hr class="divider">
        <div class="footer">
          <div class="footer-item">
            <span class="icon">👍</span>
            <span class="text">点赞: </span>
            <span class="value">{{ selectedPost.likes }}</span>
          </div>
          <div class="footer-item">
            <span class="icon">🔄</span>
            <span class="text">转发: </span>
            <span class="value">{{ selectedPost.shares }}</span>
          </div>
          <div class="footer-item">
            <span class="icon">💬</span>
            <span class="text">评论: </span>
            <span class="value">{{ selectedPost.comments }}</span>
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal v-model:visible="isBoardVisible" style="width: 800px;" title="" @cancel="isBoardVisible = false" footer="">
      <div class="board-card">
        <div class="card left-card">
          <div class="header">
            <img class="avatar" :src="leftPost.avatar" alt="头像" style="width: 50px; height: 50px; border-radius: 50%;">
            <div class="user-info">
              <div class="username">{{ leftPost.name }}</div>
              <div class="followers">粉丝数: {{ leftPost.fans }}</div>
              <!-- <div>描述 </div>
              <div>知名非律师</div>
              <div>验证信息 </div>
              <div>微博原创视频博主</div> -->
            </div>
          </div>
          <hr class="divider">
          <div class="content">
            <div v-if="leftPost.from === 'zhihu'" class="query" style="font-weight: bold;font-size: large;">
              知乎提问: {{ leftPost.keywords }}
            </div>
            <div class="date">日期: {{ leftPost.publish_time }}</div>
            <div class="text">帖子内容: {{ leftPost.text }}</div>
          </div>
          <hr class="divider">
          <div class="footer">
            <div class="footer-item">
              <span class="icon">👍</span>
              <span class="text">点赞: </span>
              <span class="value">{{ leftPost.cnt_agree }}</span>
            </div>
            <div class="footer-item">
              <span class="icon">🔄</span>
              <span class="text">转发: </span>
              <span class="value">{{ leftPost.cnt_retweet }}</span>
            </div>
            <div class="footer-item">
              <span class="icon">💬</span>
              <span class="text">评论: </span>
              <span class="value">{{ leftPost.cnt_comment }}</span>
            </div>
          </div>
        </div>

        <div class="card right-card">
          <div class="header">
            <img class="avatar" :src="rightPost.avatar" alt="头像" style="width: 50px; height: 50px; border-radius: 50%;">
            <div class="user-info">
              <div class="username">{{ rightPost.name }}</div>
              <div class="followers">粉丝数: {{ rightPost.fans }}</div>
            </div>
          </div>
          <hr class="divider">
          <div class="content">
            <div class="date">日期: {{ rightPost.publish_time }}</div>
            <div class="text">帖子内容: {{ rightPost.text }}</div>
          </div>
          <hr class="divider">
          <div class="footer">
            <div class="footer-item">
              <span class="icon">👍</span>
              <span class="text">点赞: </span>
              <span class="value">{{ rightPost.cnt_agree }}</span>
            </div>
            <div class="footer-item">
              <span class="icon">🔄</span>
              <span class="text">转发: </span>
              <span class="value">{{ rightPost.cnt_retweet }}</span>
            </div>
            <div class="footer-item">
              <span class="icon">💬</span>
              <span class="text">评论: </span>
              <span class="value">{{ rightPost.cnt_comment }}</span>
            </div>
          </div>
        </div>
      </div>
    </a-modal>


    <a-row :gutter="20">
      <a-col :span="24">
        <a-card class="content">
          <!-- 中央的圆形和点 -->
          <div>
            <svg class="circles" viewBox="-120 115 800 500">
              <!-- 黄色圆 -->
              <circle cx="150" cy="250" r="100" stroke="#51AAF3" stroke-width="4" fill="none"></circle>
              <template v-for="(point, index) in yellowPoints" :key="'yellow-template-' + index">
                <g @click="showCard(point.post)">
                  <circle :cx="point.x" :cy="point.y" r="4" :fill="point.color" />
                  <path v-for="i in 5" :key="'yellow-petal-' + index + '-' + i"
                    :d="generatePetalPath(point.x, point.y, 8, 8, (i - 1) * 72)" stroke="#6AB6F5" fill="none"
                    opacity="0.5" />
                </g>
              </template>

              <!-- 蓝色圆 -->
              <circle cx="450" cy="250" r="100" stroke="#EF8442" stroke-width="4" fill="none"></circle>
              <template v-for="(point, index) in bluePoints" :key="'blue-template-' + index">
                <g @click="showCard(point.post)">
                  <circle :cx="point.x" :cy="point.y" r="4" :fill="point.color" />
                  <path v-for="i in 5" :key="'blue-petal-' + index + '-' + i"
                    :d="generatePetalPath(point.x, point.y, 8, 8, (i - 1) * 72)" stroke="#EF8442" fill="none"
                    opacity="0.5" />
                </g>
              </template>

              <!-- 添加曲线 -->
              <defs>
                <!-- 向左的箭头 -->
                <marker id="arrow-left" markerWidth="5" markerHeight="5" refX="2" refY="2.5" orient="auto"
                  fill="#2F96EB">
                  <path d="M 0 1 L 3 2.5 L 0 4 Z" opacity="0.5" />
                </marker>

                <!-- 向右的箭头 -->
                <marker id="arrow-right" markerWidth="5" markerHeight="5" refX="2" refY="2.5" orient="auto"
                  fill="#FE9F64">
                  <path d="M 0 2.5 L 3 1 L 3 4 Z" opacity="0.5" />
                </marker>
              </defs>

              <template v-for="(connection, index) in filteredConnections" :key="'line-template-' + index">
                <line :x1="connection.yellow.x" :y1="connection.yellow.y" :x2="connection.blue.x"
                  :y2="connection.blue.y" :stroke="connection.color" :stroke-width="connection.lineWidth" fill="none"
                  stroke-opacity="0.5" :marker-start="connection.color === '#FE9F64' ? 'url(#arrow-right)' : ''"
                  :marker-end="connection.color === '#2F96EB' ? 'url(#arrow-left)' : ''"
                  @mouseenter="highlightConnection(index)" @mouseleave="removeHighlight()"
                  @click="showBoard(connection)" :class="{ highlighted: highlightedIndex === index }" />
              </template>
            </svg>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col :span="24">
        <a-card class="bottom">
          <BrokenLine :data="timeLineData" @select="selectDateHandler"></BrokenLine>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { tempClickArrows } from "@/utils/temp";
import { useTimeLineData } from "@/utils/common"
import posts from '@/assets/json/all_posts.json';
import users from '@/assets/json/all_accounts.json';
import BrokenLine from "@/components/d3/BrokenLine/index.vue"
import { ZhihuSquareFilled, WeiboSquareFilled } from '@ant-design/icons-vue';

const route = useRoute();
const routeId = route.query.id;
const currentData = tempClickArrows[routeId];
// 球数据
const data = {
  yellow: currentData.data.zhihu.value[currentData.data.zhihu.label].flat(2),
  blue: currentData.data.weibo.value[currentData.data.weibo.label].flat(2)
}

// 生成黄色圆和蓝色圆内的点
const yellowPoints = ref(generateRandomPoints(150, 250, 90, data.yellow.length, data.yellow));
const bluePoints = ref(generateRandomPoints(450, 250, 90, data.blue.length, data.blue));

// 日期数据
const timeLineData = ref([]);
timeLineData.value = ((d) => {
  // const allData = [...Object.values(d.data.zhihu.value).flat(2), ...Object.values(d.data.weibo.value).flat(2)]
  const allData = [...d.data.zhihu.value[d.data.zhihu.label].flat(2), ...d.data.weibo.value[d.data.weibo.label].flat(2)]
  return useTimeLineData(allData)
})(currentData);

// 选择时间处理函数
const selectDateHandler = (evt) => {
  // data.value = evt.flatData.flat(2);
  // yellowPoints.value = generateRandomPoints(150, 250, 90, evt.flatData[0].length, evt.flatData[0])
  // bluePoints.value = generateRandomPoints(150, 250, 90, evt.flatData[1].length, evt.flatData[1])
  // console.log(yellowPoints.value, bluePoints.value, "evt")
}

// 定义变量
const checked = ref(false);
const isCardVisible = ref(false);
const thresholdLevel = ref(0);
////////////
const isBoardVisible = ref(false);
const highlightedIndex = ref(-1);
const leftPost = ref({});
const rightPost = ref({});

// 鼠标悬停高亮曲线
const highlightConnection = (index: number) => {
  highlightedIndex.value = index;
};

const removeHighlight = () => {
  highlightedIndex.value = -1;
};

// 点击曲线时显示帖子面板
const showBoard = (connection) => {
  // 先设置为空的帖子数据
  selectedPost.avatar = '';
  selectedPost.username = '';
  selectedPost.followers = 0;
  selectedPost.date = '';
  selectedPost.content = '';
  selectedPost.likes = 0;
  selectedPost.shares = 0;
  selectedPost.comments = 0;
  selectedPost.from = '';
  selectedPost.query = '';

  // 显示卡片面板
  isBoardVisible.value = true;
  isCardVisible.value = false;
  // 可以在这里添加稍后的逻辑，加载具体的帖子数据
  leftPost.value = connection.yellow.post;
  leftPost.value.fans = users.find(item => item.name === leftPost.value.name).fan;
  rightPost.value = connection.blue.post;
  rightPost.value.fans = users.find(item => item.name === rightPost.value.name).fan;
};
//////////////

const selectedPost = reactive({
  avatar: '',
  username: '',
  followers: 0,
  date: '',
  content: '',
  likes: 0,
  shares: 0,
  comments: 0,
  from: '',
  query: '',
});


const showCard = (post: any) => {
  selectedPost.avatar = post.avatar;
  selectedPost.username = post.name;
  selectedPost.followers = users.find(item => item.name === post.name).fan;
  selectedPost.date = post.publish_time;
  selectedPost.content = post.text;
  selectedPost.likes = post.cnt_agree;
  selectedPost.shares = post.cnt_retweet;
  selectedPost.comments = post.cnt_comment;
  selectedPost.from = post.from;
  selectedPost.query = post.keywords;
  isCardVisible.value = true;
  isBoardVisible.value = false;
};

// 生成圆内均匀分布的点
function generateRandomColor() {
  const colors = ['#4b0082', '#9370db', '#fffacd', '#ffd700'];
  return colors[Math.floor(Math.random() * colors.length)];
};

function generateRandomPoints(cx: number, cy: number, r: number, numPoints: number, postList: any) {
  const points = [];
  const minDist = 15;  // Minimum distance between points to avoid overlap
  const maxAttempts = 100;  // Maximum attempts to place a point

  for (let i = 0; i < numPoints; i++) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < maxAttempts) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * r;
      const x = cx + distance * Math.cos(angle);
      const y = cy + distance * Math.sin(angle);

      const tooClose = points.some(p => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < minDist;
      });

      if (!tooClose) {
        const post = postList[i % postList.length];
        points.push({ x, y, color: generateRandomColor(), post });
        placed = true;
      }

      attempts++;
    }
  }

  return points;
};

// 生成花瓣路径
const generatePetalPath = (cx: number, cy: number, petalLength: number, petalWidth: number, angle: number) => {
  const rad = (angle * Math.PI) / 180;
  const x1 = cx + Math.cos(rad) * petalLength;
  const y1 = cy + Math.sin(rad) * petalLength;
  const x2 = cx + Math.cos(rad + Math.PI / 6) * petalWidth;
  const y2 = cy + Math.sin(rad + Math.PI / 6) * petalWidth;
  const x3 = cx + Math.cos(rad - Math.PI / 6) * petalWidth;
  const y3 = cy + Math.sin(rad - Math.PI / 6) * petalWidth;
  return `M${cx},${cy} Q${x2},${y2} ${x1},${y1} Q${x3},${y3} ${cx},${cy}`;
};

// 假设我们有一些帖子数据
const yellowPosts = posts.filter((_, index) => index % 2 === 0);
const bluePosts = posts.filter((_, index) => index % 2 !== 0);

// 创建连接
const connections = ref<any[]>([]);
const usedYellow = new Set();
const usedBlue = new Set();

const filteredConnections = computed(() => {
  const totalLines = connections.value.length; // 直接访问数组的长度
  const percentage = Math.max(0, Math.min(1, thresholdLevel.value / 20)); // 阈值百分比计算
  const displayLines = Math.ceil(totalLines * (1 - percentage));
  return connections.value.slice(0, displayLines); // 直接操作数组
});

const connectableYellowPoints = yellowPoints.value.slice(0, yellowPoints.value.length / 2);
const connectableBluePoints = bluePoints.value.slice(0, bluePoints.value.length / 2);

connectableYellowPoints.forEach((yellowPoint, yIndex) => {
  const availableBlue = connectableBluePoints.filter((_, bIndex) => !usedBlue.has(bIndex));
  if (availableBlue.length > 0) {
    const bluePoint = availableBlue[Math.floor(Math.random() * availableBlue.length)];
    const bIndex = bluePoints.value.indexOf(bluePoint);
    usedYellow.add(yIndex);
    usedBlue.add(bIndex);
    connections.value.push({
      yellow: yellowPoint,
      blue: bluePoint,
      color: Math.random() > 0.5 ? '#FE9F64' : '#2F96EB',
      lineWidth: Math.random() * 5
    });
  }
});
</script>

<style scoped lang="scss">
.icon-container {
  position: absolute;
  top: -5px;
  right: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #dad8c1 //background-color: white; /* Optional: Add a background color to the container */
}

.icon-item {
  display: flex;
  align-items: center;
  margin-left: 10px;
  /* Space between the icons */
}

.blue-square,
.orange-square {
  width: 10px;
  height: 10px;
  margin-right: 5px;
  /* Space between the square and the icon */
}

.blue-square {
  background-color: #3698e9;
}

.orange-square {
  background-color: orange;
}


.timeline-item {
  max-width: 300px;
  /* 设置最大宽度 */
  white-space: normal;
  /* 允许文本换行 */
  word-wrap: break-word;
  /* 超出部分换行 */
}

.label {
  margin-right: 10px;
  /* 添加右边距 */
  color: #000000
}

.controls {
  position: absolute;
  top: 50px;
  right: 170px;
  z-index: 10;
}

.board-card {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.card {
  width: 45%;
  /* 调整卡片宽度 */
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.left-card {
  margin-right: 10px;
  /* 左侧卡片右边距 */
}

.right-card {
  margin-left: 10px;
  /* 右侧卡片左边距 */
}

.highlighted {
  stroke-width: 4;
  stroke-opacity: 1;
}

.container {
  width: 100vw;
  height: 100vh;
  padding: 40px;
  position: relative;
  color: #ddd;
  background-color: $bgColor;
  // display: flex;
  align-items: center;
  justify-content: center;

  .content {
    height: 65vh;
    z-index: 1;
  }

  .bottom {
    margin-top: 20px;
    height: calc(100vh - 65vh - 40px - 40px);
    z-index: 1;
  }

  .circles {
    width: 100%;
  }

  .color-board {
    position: absolute;
    top: 50px;
    left: 40px;
    display: flex;
    align-items: flex-start;
    z-index: 10;

    .square {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: white;
      flex-direction: column;
      margin: 0 px;
    }

    .number {
      margin-top: 5px;
      font-size: 12px;
      color: black;
    }

    .deep-purple {
      background-color: #4b0082;
    }

    .light-purple {
      background-color: #9370db;
    }

    .light-yellow {
      background-color: #fffacd;
    }

    .deep-yellow {
      background-color: #ffd700;
    }

    .label {
      font-size: 16px;
      margin: 0 10px;
      align-self: center;
    }

    .neg {
      color: #4b0082;
    }

    .pos {
      color: #ffd700;
    }
  }

  .post-card {
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;

        margin-right: 10px;
      }

      .user-info {
        .username {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .followers {
          font-size: 12px;
          color: gray;
        }
      }
    }

    .content {
      margin-bottom: 10px;

      .date {
        font-size: 12px;
        color: gray;
        margin-bottom: 5px;
      }

      .text {
        font-size: 14px;
      }
    }

    .footer {
      .footer-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;

        .icon {
          margin-right: 5px;
        }

        .text {
          flex: 1;
        }

        .value {
          font-weight: bold;
        }
      }
    }

    .divider {
      border: none;
      border-top: 1px solid #ddd;
      margin: 10px 0;
    }
  }
}
</style>
