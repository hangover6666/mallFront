import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/layout.vue'),
      children: [
        {
          path: '',
          redirect: '/shop'   // ⭐ 默认页面（关键！）
        },
        {
          path: 'shop',
          component: () => import('@/views/shop.vue')
        },
        {
          path: 'productDetail',
          component: () => import('@/views/productDetail.vue')
        }
      ]
    }
  ],
})

export default router