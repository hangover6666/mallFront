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

      <button @click="login">登录</button>
      
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

const emit = defineEmits(["close"])
// emit("close")
const form = ref({
  username: "",
  password: "",
  code: "",
  uuid: ""
})

const captchaImg = ref("")

// 获取验证码
const getCaptcha = async () => {
  const res = await instance.get("/captcha")

  // ✅ 正确写法
  captchaImg.value = "data:image/jpeg;base64," + res.img
  form.value.uuid = res.uuid

  console.log("验证码加载成功", res)
}


const login = async () => {
  try {
    const res = await instance.post("/userLogin", form.value)

    if (res) {
      setToken(res.token)
      ElMessage.success("登录成功")
      discover()
      
      setToken(res.token)
      emit("success")
      emit("close")
    }
  } catch (error) {
    // ❌ 失败提示（后端 message）
    ElMessage.error(error.message)
    // 👉 刷新验证码
    getCaptcha()
  }
}

</script>

<style src="@/assets/styles/LoginDialog.css"></style>