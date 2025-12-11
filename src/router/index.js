import { createRouter, createWebHistory } from 'vue-router'
import ShopView from '../views/shop.vue'  // ⭐ 引入 shop.vue

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',               // 首页 '/'
      name: 'shop',
      component: ShopView      // ⭐ 首页展示 shop.vue
    },

   
  ],
})

export default router
