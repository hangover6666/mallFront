<!-- src/views/shop.vue -->
<template>
  <div class="shop-page">
    <!-- 顶部搜索栏 -->
    <header class="topbar">
      <h1 class="title">学易圈</h1>
      <div class="search">
        <input
          v-model="keyword"
          @keyup.enter="search"
          placeholder="搜索商品名称，按 Enter 或点击搜索"
        />
        <button @click="search">搜索</button>
      </div>
    </header>

    <!-- 主布局：左侧导航 + 右侧瀑布流 -->
    <main class="layout">
      
      <!-- 左侧导航栏 -->
      <aside class="sidebar">
        <button
          class="menu-btn"
          :class="{ active: activeMenu === 'discover' }"
          @click= "goDiscover"
        >
          发现
        </button>

        <button
          class="menu-btn"
          :class="{ active: activeMenu === 'publish' }"
          @click="activeMenu = 'publish'"
        >
          发布
        </button>

        <button
          class="menu-btn"
          :class="{ active: activeMenu === 'notice' }"
          @click="activeMenu = 'notice'"
        >
          通知
        </button>
      </aside>

      <!-- 右侧内容区 -->
      <div class="content">
        <div v-if="error" class="msg error">请求错误：{{ error }}</div>
        <div v-else-if="loading" class="msg loading">加载中……</div>

        <!-- 瀑布流区域 -->
        <section class="masonry" v-else>
          <article
            v-for="item in products"
            :key="item.productId"
            class="card"
          >
            <div class="card-thumb">
              <img
                v-if="item.singlePic && item.singlePic.length > 0"
                :src="BASE_URL + item.singlePic[0].productimageSrc"
                :alt="item.productName"
                class="product-img"
                loading="lazy"
              />
              <div v-else class="img-placeholder" />
            </div>

            <div class="card-body">
              <h3 class="pname">{{ item.productName }}</h3>
              <p class="ptitle" v-if="item.productTitle">{{ item.productTitle }}</p>

              <div class="meta">
                <div class="price">
                  <span class="sale">￥{{ formatPrice(item.productSalePrice) }}</span>
                  <span class="orig">￥{{ formatPrice(item.productPrice) }}</span>
                </div>
                <div class="info">
                  
                </div>
              </div>

              <div class="foot">
                <span class="date">{{ formatDate(item.productCreateDate) }}</span><br></br>
                <span class="stock">库存：{{ item.productCount ?? "--" }}</span>
              </div>
            </div>
          </article>
        </section>

        <div v-if="total > 0" class="pager">
          <button :disabled="current <= 1" @click="goPage(current - 1)">上一页</button>
          <span>第 {{ current }} 页 · 共 {{ pages }} 页 · {{ total }} 条</span>
          <button :disabled="current >= pages" @click="goPage(current + 1)">下一页</button>
        </div>

        <div v-if="!loading && products.length === 0" class="empty">暂无商品</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { GetProductListAPI, BASE_URL } from "@/request/request.js";

// 默认激活“发现”
const activeMenu = ref("discover");



// 页面状态
const loading = ref(false);
const error = ref(null);
const products = ref([]);
const total = ref(0);
const size = ref(8);
const current = ref(1);
const pages = ref(1);

// 搜索关键字
const keyword = ref("");

// 处理后端响应结构
function handleListResponse(res) {
  const payload = res.data || res;
  products.value = payload.records || [];
  total.value = payload.total || 0;
  size.value = payload.size || size.value;
  current.value = payload.current || current.value;
  pages.value = payload.pages || Math.ceil(total.value / size.value);
}

// 格式化工具
function formatPrice(v) {
  if (v == null) return "--";
  return Number(v).toFixed(2);
}
function formatDate(s) {
  return s ? new Date(s).toLocaleString() : "--";
}



const goDiscover = () => {
  activeMenu.value = "discover";  
  console.log("11");
  fetchProducts(); // ⭐ 点击发现以后刷新商品列表
};

// 获取商品数据
async function fetchProducts(params = {}) {
  loading.value = true;
  error.value = null;

  const p = {
    pageNum: 1,
    pageSize: 12,
    productName: "",
    categoryId:-1,
    isUp:"1",

    ...params,
  };

  try {
    const res = await GetProductListAPI(p);
    handleListResponse(res);
  } catch (e) {
    error.value = e.message || "请求失败";
  } finally {
    loading.value = false;
  }

  
    
}

function goPage(page) {
  fetchProducts({ pageNum: page });
  current.value = page;
}

function search() {
  fetchProducts({ pageNum: 1, productName: keyword.value });
}

// 首次加载
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* ---------------------------
   总体页面背景
----------------------------*/
.shop-page {
  min-height: 100vh;
  background: #f5f6f8;
  padding: 24px;
}

/* ---------------------------
   顶部搜索栏
----------------------------*/
.topbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.title {
  font-size: 22px;
  font-weight: 700;
  color: #111;
}
.search {
  display: flex;
  gap: 8px;
}
.search input {
  width: 320px;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
}
.search button {
  padding: 0 16px;
  border-radius: 8px;
  background: #fff;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

/* ---------------------------
   左右布局关键
----------------------------*/
.layout {
  display: flex;     
  gap: 24px;
}

/* ---------------------------
   左侧导航栏（小红书风）
----------------------------*/
.sidebar {
  width: 120px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 20px;
}

.menu-btn {
  width: 100%;
  padding: 12px 0;
  border-radius: 14px;
  border: none;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  cursor: pointer;
  transition: all .15s;
}
.menu-btn:hover {
  transform: translateY(-2px);
}
.menu-btn.active {
  background: #ff2442;
  color: #fff;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(255,36,66,.35);
}

/* ---------------------------
   右侧内容区
----------------------------*/
.content {
  flex: 1;
}

/* ---------------------------
   瀑布流布局
----------------------------*/
.masonry {
  column-count: 4;
  column-gap: 6px;
}

/* 响应式 */
@media (max-width: 1100px) { .masonry { column-count: 3; } }
@media (max-width: 800px)  { .masonry { column-count: 2; } }
@media (max-width: 480px)  { .masonry { column-count: 1; } }

/* ---------------------------
   商品卡片
----------------------------*/
.card {
  break-inside: avoid;
  /* width: 100%; */
  min-width: 220px; /* 下限设宽一点 */
  margin-bottom: 6px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: .15s;
}
.card:hover {
  transform: translateY(-4px);
}

/* 图片区域（等比缩放，不裁切） */
.card-thumb {
  width: 100%;
  background: #fff;
}
.product-img {
  width: 100%;
  height: auto;
  object-fit: contain;   /* 不裁切 */
  border-radius: 7%;
  background: #fff;
  padding: 4px;
}

.img-placeholder {
  width: 100%;
  height: 200px;
  background: #f9f9f9;
}

/* 文字区 */
.card-body {
  padding: 12px 14px;
}
.pname {
  font-size: 14px;
  height: 3.0em;
  overflow: hidden;
}
.ptitle {
  font-size: 9px;
  color: #666;
  margin-bottom: 6px;
}
.stock{
  font-size: 10px;
  color: #666;
  /* display: flex; */
  /* justify-content:space-around; */
}
.meta {
  display: flex;
  justify-content: space-between;
}
.sale {
  color: #ff2442;
  font-size: 18px;
  font-weight: bold;
}
.orig {
  color: #999;
  font-size: 10px;
  text-decoration: line-through;
}
.foot {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

/* 分页 */
.pager {
  margin-top: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.pager button {
  padding: 8px 12px;
  background: #fff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

/* 无数据提示 */
.empty {
  text-align: center;
  margin-top: 20px;
  color: #666;
}
</style>
