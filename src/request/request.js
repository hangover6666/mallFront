// import instance from "./axios"


// export const BASE_URL = "http://localhost:8081/";

// // 查询商品列表
// export const GetProductListAPI = (params) => {return instance.get("/product/list", { params })}


import instance from "./axios";
import { API_BASE_URL } from "@/config/urls";

// 你之前的 BASE_URL 可以升级成 API_BASE_URL
export const BASE_URL = API_BASE_URL;

// 商品列表接口
export const GetProductListAPI = (params) => {
  return instance.get("/product/list", { params });
};
