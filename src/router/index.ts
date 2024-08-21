import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: () => import("@/views/index/index.vue") },
  { path: "/post", component: () => import("@/views/post/index.vue") }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
