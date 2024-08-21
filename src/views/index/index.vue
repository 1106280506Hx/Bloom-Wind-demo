<template>
  <div class="container">
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

    <a-spin :spinning="checkSpinning">
      <!-- 添加部分：引入了 color-board -->
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
      <!-- 添加部分：引入了 color-board -->


      <a-row :gutter="20">
        <a-col :span="24">
          <a-card class="content">
            <div style="display: flex" :style="{ opacity: checkSpinning ? 0 : 1 }">
              <ClusterGroup :data="groupMap" @sectorClick="showCard" @arrowsClick="goToPost"
                @bubbleClick="showWordCloudCard"></ClusterGroup>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="20">
        <a-col :span="24">
          <a-card class="bottom">
            <BrokenLine :data="postsMapToDayLine" :isBrush="true" @select="selectDateHandler"></BrokenLine>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
    <!-- 添加部分：引入了卡片弹窗 -->
    <a-modal v-model:visible="isCardVisible" title="代表性帖子" @cancel="isCardVisible = false" footer="">
      <div class="post-card">
        <div class="header">
          <img class="avatar" :src="selectedPost.avatar" alt="头像" />
          <div class="user-info">
            <div class="username">{{ selectedPost.username }}</div>
            <div class="followers">粉丝数: {{ selectedPost.followers }}</div>
          </div>
        </div>
        <hr class="divider" />
        <div class="content">
          <div v-if="selectedPost.from === 'zhihu'" class="query" style="font-weight: bold;font-size: large;">
          知乎提问: {{ selectedPost.query }}
        </div>
          <div class="date">日期: {{ selectedPost.date }}</div>
          <div class="text">帖子内容: {{ selectedPost.content }}</div>
        </div>
        <hr class="divider" />
        <div class="footer">
          <div class="footer-item">
            <span class="icon">👍</span>
            <span class="text">点赞:</span>
            <span class="value">{{ selectedPost.likes }}</span>
          </div>
          <div class="footer-item">
            <span class="icon">🔄</span>
            <span class="text">转发:</span>
            <span class="value">{{ selectedPost.shares }}</span>
          </div>
          <div class="footer-item">
            <span class="icon">💬</span>
            <span class="text">评论:</span>
            <span class="value">{{ selectedPost.comments }}</span>
          </div>
        </div>
      </div>
    </a-modal>
    <!-- 添加部分：引入了卡片弹窗 -->

    <!-- 词云弹窗 -->
    <a-modal v-model:visible="isWordCloudCardVisible" title="词云" @cancel="isWordCloudCardVisible = false" footer="">
      <WordCloud :options="wordCloudData"></WordCloud>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import BrokenLine from "@/components/d3/BrokenLine/index.vue";
import ClusterGroup from "@/components/d3/clusterGroup/index.vue";
import WordCloud from "@/components/d3/WordCloud/index.vue";
import posts from "@/assets/json/all_posts.json";
import users from "@/assets/json/all_accounts.json";
import { groupBy } from "lodash";
import { message } from 'ant-design-vue';
import { genSum } from "@/components/d3/RadialStackedBar/gen";
import { tempClickArrows } from "@/utils/temp";
import { SegmenterWord } from "@/utils/i18";
import { useTimeLineData } from "@/utils/common";
import { ZhihuSquareFilled, WeiboSquareFilled } from '@ant-design/icons-vue';

const router = useRouter();
const postsMapToDayLine = useTimeLineData(posts);

const groupMap = reactive({
  weibo: {},
  zhihu: {}
});

const checkSpinning = ref(false);
const selectDateHandler = (event: any) => { 
  const baseData1 = {
    AEB: [],
    事故: [],
    四大疑问_说明: [],
    家属发声: [],
    问界回应: [],
    [""]: [],
  }
  const baseData2 = {
    四大疑问_说明: [],
    事故: [],
    AEB: [],
    [""]: [],
    问界回应: [],
    家属发声: [],
  }
  message.info(`选择了${dayjs(event.startDate).format("YYYY-MM-DD HH:mm:ss")}~${dayjs(event.endDate).format("YYYY-MM-DD HH:mm:ss")}中的${event.flatData[0].length + event.flatData[1].length}条数据`);
  if (event.flatData[0].length+event.flatData[1].length === 0) {
    groupMap.weibo = {};
    groupMap.zhihu = {};
    return;
  }
  checkSpinning.value = true;
  groupMap.weibo = groupBy(event.flatData[0], (item: any) => item.cluster);
  groupMap.zhihu = groupBy(event.flatData[1], (item: any) => item.cluster);

  // 补全数据中没有的组
  groupMap.weibo = Object.assign(JSON.parse(JSON.stringify(baseData2)), groupMap.weibo)
  groupMap.zhihu = Object.assign(JSON.parse(JSON.stringify(baseData1)), groupMap.zhihu)
  // delete groupMap.weibo[""];
  // delete groupMap.zhihu[""];
  setTimeout(
    () => {
      checkSpinning.value = false;
    },
    Math.random() * 1000 * 1
  );
};

const by = groupBy(posts, item => item.from);
selectDateHandler({
  flatData: [by.weibo, by.zhihu]
});
//添加部分： 定义变量
const isCardVisible = ref(false);
const selectedPost = reactive({
  avatar: "",
  username: "",
  followers: 0,
  date: "",
  content: "",
  likes: 0,
  shares: 0,
  comments: 0,
  from: "",
  query: ""
});

const showCard = (evt: any) => {
  // 找出最具有影响力的帖子(true代表点击的是有影响力的, false没影响力)
  const f = evt.value === evt.sumData[0];
  evt.children.sort((a, b) => {
    return genSum(a) - genSum(b);
  });

  const post = f ? evt.children.at(-1) : evt.children[0];
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
};

// 统计词云
const getWordCloudLength = (data: any[]) => {
  const total: { name: string; value: number }[] = [];
  for (const item of data) {
    const wordMap = SegmenterWord(item.text).filter(
      word => word.segment.length > 1
    );
    // console.log(wordMap, "map")
    for (const word of wordMap) {
      const findWord = total.find(w => w.name === word.segment);
      if (findWord) {
        findWord.value++;
      } else {
        total.push({ name: word.segment, value: 1 });
      }
    }
  }
  return total.filter(i => i.value > 10);
};

const isWordCloudCardVisible = ref(false);
const wordCloudData = reactive({
  series: [
    {
      gridSize: 20,
      data: []
    }
  ]
});
// 显示词云
const showWordCloudCard = (data: any) => {
  wordCloudData.series[0].data = getWordCloudLength(data);
  isWordCloudCardVisible.value = true;
};

// 点击箭头跳到详情
const goToPost = (evt: any) => {
  const randomKey = Math.random().toString(16).slice(-8);
  tempClickArrows[randomKey] = evt;
  router.push(`/post?id=${randomKey}`);
};
//添加部分： 定义变量
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

.container {
  width: 100vw;
  height: 110vh;
  padding: 40px;
  color: $color;
  background-color: $bgColor;
  position: relative;

  .content {
    height: 65vh;
  }

  .bottom {
    margin-top: 20px;
    height: calc(100vh - 65vh - 40px - 40px);
  }

  //添加新的css样式
  .color-board {
    position: absolute;
    top: 10px;
    left: 0px;
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

  .show-card-button {
    position: absolute;
    top: 20px;
    z-index: 10;
    right: 20px;
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .show-card-button:hover {
    background-color: #0056b3;
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

//添加新的css样式</style>
