<!-- src/views/shop.vue -->
<template>
  <div class="shop-page">
    <!-- 顶部搜索栏   转移到了layout --> 
    

    <!-- 主布局：左侧导航 + 右侧瀑布流 -->
    <main class="layout">

      <!-- 左侧导航栏 -->
      <aside class="sidebar">
        <button class="menu-btn" :class="{ active: activeMenu === 'discover' }" @click="goDiscover">
          发现
        </button>

        <button class="menu-btn" :class="{ active: activeMenu === 'publish' }" @click="activeMenu = 'publish'">
          发布
        </button>

        <button class="menu-btn" :class="{ active: activeMenu === 'notice' }" @click="activeMenu = 'notice'">
          通知
        </button>
      </aside>

      <!-- 右侧内容区 -->
      <div class="content">
        <div v-if="error" class="msg error">请求错误：{{ error }}</div>
        <div v-else-if="loading" class="msg loading">加载中……</div>

        <!-- 瀑布流区域 -->
        <section class="masonry" v-else>
          <article v-for="item in products" :key="item.productId" class="card" @click="goDetail(item.productId)"
            style="cursor: pointer;">
            <div class="card-thumb">
              <img v-if="item.singlePic && item.singlePic.length > 0"
                :src="BASE_URL + '/' + item.singlePic[0].productimageSrc" :alt="item.productName" class="product-img"
                loading="lazy" />
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
import { ref, onMounted,watch } from "vue";
import { GetProductListAPI ,BASE_URL } from "@/request/request.js";
import { ADMIN_SYSTEM_URL } from "@/config/urls";
import { useRouter } from 'vue-router'  //  引入的是“钩子函数”，不是 router 文件
import { getToken, removeToken } from "@/utils/auth"


// 默认激活“发现”
const activeMenu = ref("discover");
//默认未登录
const router = useRouter()  //获取路由实例




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
    categoryId: -1,
    isUp: "1",

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

// 跳转方法
function goDetail(id) {
  console.log("1");
  router.push({
    path: '/productDetail',
    query: {
      id: id
    }
  })
}

function goPage(page) {
  fetchProducts({ pageNum: page });
  current.value = page;
}

function search() {
  fetchProducts({ pageNum: 1, productName: keyword.value });
}

// -------------------------
// 管理员入口跳转（新增）2025-12.17
// -------------------------
const goAdmin = () => {
  // 企业做法：直接跳转到后台系统
  window.open(ADMIN_SYSTEM_URL, "_blank");
};

// onMounted(() => {
//   fetchProducts({
//     productName: route.query.keyword || ""
//   })
// })


// 首次加载
onMounted(() => {
  fetchProducts();
});

//下面这段代码，如果不注释，
watch(
  () => router.keyword,
  (newKeyword) => {
    fetchProducts({ productName: newKeyword || "" });
  });




</script>

<style src="@/assets/styles/shop.css"></style>
