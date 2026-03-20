<!-- src/views/shop.vue -->
<template>
  <div class="shop-page">
    <!-- 顶部搜索栏 -->
    <header class="banner">

      <!-- 左侧：品牌 / 站点名 -->
      <div class="banner-left">
        <h1 class="logo">邝码</h1>
      </div>

      <!-- 中间：商品搜索框（你要移动到这里的） -->
      <div class="banner-center">
        <input v-model="keyword" class="search-input" placeholder="搜索商品名称" @keyup.enter="search" />
        <button class="search-btn" @click="search">搜索</button>
      </div>

      <!-- 右侧：用户+管理员入口 -->
      <div class="banner-right">

        <LoginDialog v-if="showLogin" @close="showLogin = false" @success="handleLoginSuccess" />
        <!-- 未登录 -->
        <button v-if="!isLogin" @click="showLogin = true" class="login-btn">
          登录
        </button>
        <!-- 已登录 -->
        <div v-else class="user-box" >
          <span class="username">{{ username }}已登录</span>
          <button @click="logout" class="login-btn">退出</button>
        </div>
        <button class="admin-btn" @click="goAdmin">
          管理员登录
        </button>
      </div>

    </header>

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
import { ref, onMounted } from "vue";
import { GetProductListAPI, LogoutAPI ,BASE_URL } from "@/request/request.js";
import { ADMIN_SYSTEM_URL } from "@/config/urls";
import { useRouter } from 'vue-router'  //  引入的是“钩子函数”，不是 router 文件
import LoginDialog from "@/components/LoginDialog.vue" //引入登录模块
import { getToken, removeToken } from "@/utils/auth"


// 默认激活“发现”
const activeMenu = ref("discover");
//默认未登录
const showLogin = ref(false)
const router = useRouter()  //获取路由实例
const isLogin = ref(false)



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

//检查是否登录
const checkLogin = () => {
  if (!isLogin.value) {
    showLogin.value = true
    return false
  }
  return true
}

const handleLoginSuccess = () => {
  isLogin.value = true
}


onMounted(() => {
  isLogin.value = !!getToken()
})

const logout = async () => {
  console.log("点击退出了")  // ⭐ 加这一行
  try {
    // ⭐ 先通知后端（此时 token 还在）
    await LogoutAPI()
  } catch (e) {
    console.log("后端登出失败", e)
  } finally {
    // ⭐ 再删除本地 token
    removeToken()
    isLogin.value = false

    ElMessage.success("已退出登录")
  }
}

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

// 首次加载
onMounted(() => {
  fetchProducts();
});
</script>

<style src="@/assets/styles/shop.css"></style>
