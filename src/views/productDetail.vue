<template>
  <div class="container" v-if="product">
    
    <!-- 上半部分 -->
    <div class="top">

  <!-- 左侧 -->
  <div class="left">

    <div class="img-box">
      <img :src="BASE_URL + '/' + currentImg" class="main-img" />
    </div>

    <div class="thumbs">
      <img
        v-for="(img, index) in product.detailPic"
        :key="index"
        :src="BASE_URL + '/' + img.productimageSrc"
        :class="{ active: currentImg === img.productimageSrc }"
        @click="currentImg = img.productimageSrc"
      />
    </div>

  </div>

  <!-- 右侧 -->
  <div class="right">

    <h1 class="name">{{ product.productName }}</h1>
    <p class="title">{{ product.productTitle }}</p>

    <div class="divider"></div>

    <div class="price-box">
      <span class="sale">￥{{ product.productSalePrice }}</span>
      <span class="origin">￥{{ product.productPrice }}</span>
    </div>

    <div class="stock">库存 {{ product.productCount }}</div>

    <div class="divider"></div>

    <div class="props-scroll">
    <div class="props">
        <div
        class="prop-card"
        v-for="item in product.propvalues"
        :key="item.propertyvalueId"
        >
        <div class="prop-name">
            {{ item.propertyName }}
        </div>
        <div class="prop-value">
            {{ item.propertyvalueValue || '暂无' }}
        </div>
        </div>
    </div>
    </div>

    <div class="count-box">
      <span>数量</span>
      <input type="number" v-model="count" min="1" />
    </div>

    <div class="actions">
      <button class="cart" @click="addToCart">加入购物车</button>
      <button class="buy">立即购买</button>
    </div>

  </div>
</div>

    <!-- 下半部分：详情图片 -->
    <div class="detail">
      <h3>商品详情</h3>
      <img
        v-for="(img, index) in product.detailPic"
        :key="index"
        :src="BASE_URL + '/' + img.productimageSrc"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BASE_URL } from "@/request/request.js";
import axios from 'axios'
import { ElMessage } from 'element-plus';

// 基础路径
// const BASE_URL = 'http://localhost:8081'

// 获取路由参数
const route = useRoute()
const id = route.query.id
// 购买数量
const count = ref(1)
// 商品数据
const product = ref(null)
const loading = ref(false)

// 当前展示图片
const currentImg = ref('')

// 获取商品详情
function getDetail() {
  axios.get(`${BASE_URL}/product/info/${id}`)
    .then(res => {
      if (res.data.code === 200) {
        product.value = res.data.data

        // 默认显示第一张详情图
        if (product.value.detailPic.length > 0) {
          currentImg.value = product.value.detailPic[0].productimageSrc
        }
      }
    })
}


// ⭐ 加入购物车
const addToCart = async () => {
  if (loading.value) return

  if (count.value <= 0) {
    ElMessage.warning("数量必须大于1")
    return
  }

  loading.value = true

  try {
    const res = await axios.post(`${BASE_URL}/cart`, {
      productId: id,
      count: count.value
    }, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })

    if (res.data.code === 200) {
      ElMessage.success("加入购物车成功")
    } else {
      ElMessage.error(res.data.message)
    }

  } catch (e) {
    ElMessage.error("失败：" + e.message)
    
  
  } finally {
    loading.value = false
  }
}




// 页面加载执行
onMounted(() => {
  getDetail()
})
</script>

<style scoped>
.container {
  width: 1200px;
  /* margin: 1px auto; */
  padding: 10px;
  background: #f7f5f2;
}

/* 顶部卡片 */
.top {
  display: flex;
  gap: 50px;
  padding: 40px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 
    0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid #ebe8e4;
}

/* 左侧 */
.left {
  width: 420px;
}

.img-box {
  border-radius: 12px;
  overflow: hidden;
  background: #f2f2f2;
  border: 1px solid #eee;
}

.main-img {
  width:100%;
  display: block;
  transition: 0.4s;
}

.main-img:hover {
  transform: scale(1.04);
}

/* 缩略图 */
.thumbs {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.thumbs img {
  width: 65px;
  height: 65px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #ddd;
  opacity: 0.6;
  transition: all 0.3s;
}

.thumbs img:hover {
  opacity: 1;
}

.thumbs img.active {
  border-color: #333;
  opacity: 1;
}

/* 右侧 */
.right {
  flex: 1;
  min-width: 0;   /* ⭐⭐⭐ 关键！！！ */
}

/* 标题 */
.name {
  font-size: 28px;
  font-weight: 600;
  color: #222;
}

.title {
  color: #888;
  margin-top: 10px;
  line-height: 1.6;
}

/* 分割线（关键质感） */
.divider {
  height: 1px;
  margin: 25px 0;
  background: #eee;
}

/* 价格 */
.price-box {
  display: flex;
  align-items: baseline;
  gap: 15px;
}

.sale {
  font-size: 32px;
  color: #222;
  font-weight: bold;
}

.origin {
  text-decoration: line-through;
  color: #bbb;
}

/* 库存 */
.stock {
  font-size: large;
  margin-top: 10px;
  color: #999;
}


.prop-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fafafa;
  border: 1px solid #eee;
}

/* ⭐ 外层：控制横向滚动 */
.props-scroll {
  overflow-x: auto;
  margin: 15px 0;
}

/* ⭐ 内层：横排 */
.props {
  display: flex;
  gap: 10px;
  min-width: max-content; /* 关键！保证横向扩展 */
  max-width: 100%;   /*  防止撑出父容器 */
}

/* ⭐ 单个属性卡片 */
.prop-card {
  min-width: 90px;
  padding: 10px;
  flex-shrink: 0;   /* ⭐ 防止被压缩 */
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-top: none;
  border-bottom: none;

  text-align: center;
  background: #fafafa;
  border-radius: 4px;
}

/* 属性名 */
.prop-name {
  font-size: 12px;
  color: #999;
}

/* 属性值 */
.prop-value {
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
}

.label {
  color: #777;
}

.value {
  color: #222;
  font-weight: 500;
}

/* 数量 */
.count-box {
  margin-top: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #666;
}

.count-box input {
  width: 90px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
}

/* 按钮 */
.actions {
  margin-top: 35px;
  display: flex;
  gap: 15px;
}

.actions button {
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.25s;
}

/* 加入购物车 */
.cart {
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
}

.cart:hover {
  background: #f3f3f3;
}

/* 立即购买（唯一强调色） */
.buy {
  background: #222;
  color: #fff;
}

.buy:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
}

/* 下部分 */
.detail {
  margin-top: 40px;
  padding: 30px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #ebe8e4;
}

.detail h3 {
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
  border-left: 3px solid #222;
  padding-left: 10px;
}

.detail img {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 15px;
}
</style>