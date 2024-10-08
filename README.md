# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur

- Use [vue-tsc](https://github.com/vuejs/language-tools/tree/master/packages/tsc) for performing the same type checking from the command line, or for generating d.ts files for SFCs.

## demo

### preview GIF
![](https://github.com/1106280506Hx/Bloom-Wind-demo/blob/main/public/tutieshi_640x360_184s.gif)

### Cluster-Level

The cluster-level influence model is used to evaluate the likelihood of a topic spreading from platform i to platform j during a specific time period. It mainly considers the following three factors:
- Information Salience (S): The higher the relevance of a topic, the greater the likelihood of its spread. This can be measured by the number of posts related to the topic.
- KOL Influence (K): Key Opinion Leaders (KOLs) or posts with significant influence on a platform are more likely to be spread to other platforms.
- Recency Effect (E): The higher the similarity in content among posts related to the topic, the greater the likelihood of its spread.

The calculation formula is as follows:
![](https://github.com/1106280506Hx/Bloom-Wind-demo/blob/main/public/f1.png)

- K: Represents the influence of KOLs.
- S: Represents the significance of the information.
- E: Represents the content relevance.

![](https://github.com/1106280506Hx/Bloom-Wind-demo/blob/main/public/f2.png)

![](https://github.com/1106280506Hx/Bloom-Wind-demo/blob/main/public/cluster.png)

### Post-Level

In the BloomWind system, the post-level influence model is used to estimate the probability of a specific post being disseminated across different platforms and to identify its dissemination pattern. The model takes into account the following factors:

Content Relevance (CR):
  - URL Sharing: Checks whether the content of the target post includes the URL of the source post, which provides evidence of direct dissemination.
  - Text Similarity: Calculates the similarity between the texts of two posts, including both the written content and hashtags, as well as the similarity between URLs.
  - Sentiment Analysis: Examines whether the sentiment expressed in both posts is similar, such as whether they convey positive or negative emotions.

User Relevance (UR):
  - User Information Similarity: Computes the similarity between the user information of the two posts' authors, such as usernames, profiles, and verification details.
  - Interest Distribution Similarity: Analyzes the historical posting content of the users to assess whether they are interested in similar topics.

Historical Relevance (HR):
  - Historical Dissemination Relationships: Checks the historical posting records of the two users to see if there is a cross-platform dissemination relationship.
  - Historical Posting Frequency: Calculates the frequency of posts made by the two users on specific topics to evaluate their interaction level.

Timeliness (t(W) - t(T)):
  - Time Difference: Calculates the time difference between the publication times of the target and source posts to assess the impact of timeliness on dissemination.

The calculation formula is as follows:

![](https://github.com/1106280506Hx/Bloom-Wind-demo/blob/main/public/f3.png)

![](https://github.com/1106280506Hx/Bloom-Wind-demo/blob/main/public/post.png)

### Word-Cloud
![](https://github.com/1106280506Hx/Bloom-Wind-demo/blob/main/public/word.png)

### Post
![](https://github.com/1106280506Hx/Bloom-Wind-demo/blob/main/public/tiezi.png)

## How to use
1. npm install
2. npm run dev
