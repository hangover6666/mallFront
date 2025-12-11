import instance from "./axios"


export const BASE_URL = "http://localhost:8081/";

// 查询商品列表
export const GetProductListAPI = (params) => {return instance.get("/product/list", { params })}


