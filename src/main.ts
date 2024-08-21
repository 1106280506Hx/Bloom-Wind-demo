import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index";
import Antd from "ant-design-vue";
import App from "./App.vue";
import "ant-design-vue/dist/reset.css";
import "@/assets/scss/index.scss";
import "@/assets/scss/ant-mixin.scss";

const app = createApp(App);
const store = createPinia();
app.use(router);
app.use(store);
app.use(Antd);

app.mount("#app");
