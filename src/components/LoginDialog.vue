<template>
  <div class="mask" v-if="visible">
    <div class="login-box">
      
      <h2>用户登录</h2>
      
      <input v-model="form.username" placeholder="账号" />
      <input v-model="form.password" type="password" placeholder="密码" />

      <div class="captcha-box">
        <input v-model="form.code" placeholder="验证码" />
        <img :src="captchaImg" @click="getCaptcha" />
      </div>

      <!-- <button @click="login">登录</button> -->
      <!-- ⭐ 登录按钮防重复点击 -->
      <button @click="login" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>

      <button @click="emit('close')">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import instance from "@/request/axios"
import { setToken } from "@/utils/auth"
import { ElMessage } from 'element-plus'
const visible = ref(true)
const emit = defineEmits(["close", "success"]) //  增加 success 事件


const form = ref({
  username: "",
  password: "",
  code: "",
  uuid: ""
})

const captchaImg = ref("")
const loading = ref(false) //  防重复点击


// 获取验证码
const getCaptcha = async () => {
  const res = await instance.get("/captcha")

  // ✅ 正确写法
  captchaImg.value = "data:image/jpeg;base64," + res.img
  form.value.uuid = res.uuid

  console.log("验证码加载成功", res)
}


// 登录
const login = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const res = await instance.post("/userLogin", form.value)

    console.log("res:", res)

    // ⭐ 这里 res 就是 data 了
    if (res && res.token) {

      setToken(res.token)
      localStorage.setItem("username", res.userName)

      ElMessage.success("登录成功")

      
      emit("success", { userName: res.userName })
      emit("close")

    } else {
      ElMessage.error("登录失败")
      getCaptcha()
    }

  } catch (error) {
    ElMessage.error(error.message || "请求异常")
    getCaptcha()
  } finally {
    loading.value = false
  }
}

</script>

<style src="@/assets/styles/LoginDialog.css"></style>