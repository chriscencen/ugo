import Vue from "vue";
import App from "./App";
// 导入封装请求模块
import request from "@/utils/request.js";

Vue.config.productionTip = false;

const plugin = request({
  baseURL: "https://ugo.botue.com"
  // 备用域名
  // https://www.zhengzhicheng.cn
  // https://autumnfish.cn/wx
  // https://www.uinav.com
});

Vue.use(plugin);
App.mpType = "app";

const app = new Vue({
  ...App
});
app.$mount();
