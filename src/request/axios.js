// src/request/axios.js
/**
 * 全局 axios 实例（统一请求层）
 * - 设置 baseURL（后端地址）
 * - 请求拦截器：可在此加入 token（当前免登录，可留空）
 * - 响应拦截器：统一处理 code、错误提示
 */

import axios from "axios";

// 创建 axios 实例，baseURL 指向后端（开发时用后端地址或使用 Vite proxy）
const service = axios.create({
  baseURL: "http://localhost:8081", // 后端统一入口 (按需修改)
  timeout: 10_000, // 超时时间 10s
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器（发送前处理）
service.interceptors.request.use(
  (config) => {
    // 如果将来支持登录，可在这里注入 token，例如：
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（统一处理响应）
service.interceptors.response.use(
  (response) => {
    // 假设后端返回结构为 { code, message, data }
    const res = response.data;
    if (res && res.code && res.code !== 200) {
      // 非业务成功，reject 并在页面处理错误信息
      return Promise.reject(new Error(res.message || "Error"));
    }
    // 成功直接返回 data（如果没有 code 字段，返回整个 res）
    return res && res.data !== undefined ? res.data : res;
  },
  (error) => {
    // 网络错误或非 2xx
    // 这里可以统一返回一个格式化错误
    const message = error.response?.data?.message || error.message || "Network Error";
    return Promise.reject(new Error(message));
  }
);

export default service;
