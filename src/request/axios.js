// src/request/axios.js
/**
 * 全局 axios 实例（统一请求层）
 * - 设置 baseURL（后端地址）
 * - 请求拦截器：可在此加入 token（当前免登录，可留空）
 * - 响应拦截器：统一处理 code、错误提示
 */

import axios from "axios";
import { getToken } from "@/utils/auth"
import { ElMessage } from "element-plus"

// 创建 axios 实例，baseURL 指向后端（开发时用后端地址或使用 Vite proxy）
const service = axios.create({
  baseURL: "http://localhost:8081", // 后端统一入口 (按需修改)
  timeout: 10_000, // 超时时间 10s
  headers: {
    "Content-Type": "application/json",
  },
});



// 响应拦截器（统一处理响应）
// service.interceptors.response.use(
//   (response) => {
//     // 假设后端返回结构为 { code, message, data }
//     const res = response.data;
//     if (res && res.code && res.code !== 200) {
//       // 非业务成功，reject 并在页面处理错误信息
//       return Promise.reject(new Error(res.message || "Error"));
//     }
//     // 成功直接返回 data（如果没有 code 字段，返回整个 res）
//     return res && res.data !== undefined ? res.data : res;
//   },
//   (error) => {
//     // 网络错误或非 2xx
//     // 这里可以统一返回一个格式化错误
//     const message = error.response?.data?.message || error.message || "Network Error";
//     return Promise.reject(new Error(message));
//   }
// );




service.interceptors.request.use(config => {

  const token = getToken()

  if (token) {
    // ⭐ 改成 Authorization（和后端一致）
    config.headers["Authorization"] = token
  }

  return config
})


service.interceptors.response.use(

  (response) => {
    const res = response.data

    // ❌ 业务错误（例如：验证码错误）
    if (res && res.code && res.code !== 200) {
      return Promise.reject(new Error(res.message || "Error"))
    }

    return res && res.data !== undefined ? res.data : res
  },

  (error) => {

    // 🔥 重点：token 失效处理
    if (error.response?.status === 401) {

      ElMessage.error("登录已失效，请重新登录")

      // 清除 token
      removeToken()

      // 👉 可选：刷新页面（推荐）
      setTimeout(() => {
        window.location.reload()
      }, 1500)

      return Promise.reject(error)
    }

    // 其他错误
    const message =
      error.response?.data?.message ||
      error.message ||
      "网络错误"

    ElMessage.error(message)

    return Promise.reject(new Error(message))
  }
)

export default service;
