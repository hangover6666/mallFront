<template>
  <div class="container" v-if="product">
    
    <!-- 上半部分 -->
    <div class="top">
      
      <!-- 左侧：轮播图 -->
      <div class="left">
        <img 
          :src="BASE_URL + '/' + currentImg" 
          class="main-img"
        />

        <!-- 缩略图 -->
        <div class="thumbs">
          <img
            v-for="(img, index) in product.detailPic"
            :key="index"
            :src="BASE_URL + '/' + img.productimageSrc"
            @click="currentImg = img.productimageSrc"
          />
        </div>
      </div>

      <!-- 右侧：商品信息 -->
      <div class="right">
        <h2 class="name">{{ product.productName }}</h2>
        <p class="title">{{ product.productTitle }}</p>

        <div class="price-box">
          <span class="sale">￥{{ product.productSalePrice }}</span>
          <span class="origin">￥{{ product.productPrice }}</span>
        </div>

        <div class="stock">库存：{{ product.productCount }}</div>

        <!-- 属性 -->
        <div class="props">
          <div v-for="item in product.propvalues" :key="item.propertyvalueId">
            {{ item.propertyName }}：{{ item.propertyvalueValue || '暂无' }}
          </div>
        </div>

        <!-- 按钮 -->
        <div class="actions">
          <button class="cart">加入购物车</button>
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

// 基础路径
// const BASE_URL = 'http://localhost:8081'

// 获取路由参数
const route = useRoute()
const id = route.query.id

// 商品数据
const product = ref(null)

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

// 页面加载执行
onMounted(() => {
  getDetail()
})
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 20px auto;
  background: #fff;
  padding: 20px;
}

/* 上部分 */
.top {
  display: flex;
  gap: 40px;
}

/* 左侧图片 */
.left {
  width: 400px;
}

.main-img {
  width: 100%;
  border-radius: 8px;
}

.thumbs {
  display: flex;
  margin-top: 10px;
  gap: 10px;
}

.thumbs img {
  width: 60px;
  height: 60px;
  cursor: pointer;
  border: 1px solid #ddd;
}

/* 右侧 */
.right {
  flex: 1;
}

.name {
  font-size: 22px;
  font-weight: bold;
}

.title {
  color: #888;
  margin: 10px 0;
}

.price-box {
  margin: 20px 0;
}

.sale {
  color: red;
  font-size: 26px;
  margin-right: 10px;
}

.origin {
  text-decoration: line-through;
  color: #aaa;
}

.stock {
  margin-bottom: 10px;
  font-size: 20px;
}

/* 属性 */
.props {
  margin: 20px 0;
  color: #555;
}

/* 按钮 */
.actions button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
}

.cart {
  background: orange;
  color: #fff;
}

.buy {
  background: red;
  color: #fff;
}

/* 下部分 */
.detail {
  margin-top: 40px;
}

.detail img {
  width: 100%;
  margin-bottom: 10px;
}
</style>