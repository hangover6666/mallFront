<template>
    <div>
        
        <header class="banner">

            <div class="banner-left">
                <h1 class="logo" @click="goHome">邝码</h1>
            </div>

            <div class="banner-center">
                <input v-model="keyword" class="search-input" placeholder="搜索商品名称" />
                <button class="search-btn" @click="search">搜索</button>
            </div>

            <div class="banner-right">
                <!-- 登录弹窗 -->
                <LoginDialog v-if="showLogin" @close="showLogin = false" @success="handleLoginSuccess" />

                <!-- ❗ 未登录 -->
                <button v-if="!isLogin" @click="showLogin = true" class="login-btn">
                    登录
                </button>

                <!-- ❗ 已登录 -->
                <div v-else class="user-box">
                    <span class="username">{{ username }}已登录</span>
                    <button @click="logout" class="login-btn">退出</button>
                </div>

                <button class="admin-btn" @click="goAdmin">管理员登录</button>
            </div>

        </header>

        <!-- ⭐ 页面内容出口 -->
        <router-view />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoginDialog from '@/components/LoginDialog.vue'
import { LogoutAPI } from '@/request/request.js'
import { ADMIN_SYSTEM_URL } from "@/config/urls"
import { useRouter } from 'vue-router'


// 路由
const router = useRouter()

// 状态

const username = ref('')
const showLogin = ref(false)
const isLogin = ref(false)
const keyword = ref('')

// ⭐ 初始化登录状态
onMounted(() => {
    const token = localStorage.getItem("token")
    const name = localStorage.getItem("username")

    if (token) {
        isLogin.value = true
        username.value = name
    }
})


const goHome = () => {
  router.push('/shop')  // ⭐ 回到首页
}

// ⭐ 登录成功
const handleLoginSuccess = () => {
    showLogin.value = false

    isLogin.value = true              // ⭐ 立刻更新状态
    
}

// ⭐ 退出登录
const logout = async () => {
    try {
        await LogoutAPI()
    } catch (e) {
        console.log("后端登出失败", e)
    } finally {
        localStorage.removeItem("token")
        localStorage.removeItem("username")

        isLogin.value = false
        username.value = ''
    }
}

// ⭐ 搜索（跳回 shop 页面）
const search = () => {
    router.push({
        path: '/shop',
        query: {
            keyword: keyword.value
        }
    })
}



// ⭐ 管理员入口
const goAdmin = () => {
    window.open(ADMIN_SYSTEM_URL, "_blank")
}
</script>