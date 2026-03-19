// 获取 token
export const getToken = () => {
  return localStorage.getItem("token")
}

// 保存 token
export const setToken = (token) => {
  localStorage.setItem("token", token)
}

// 删除 token（退出登录）
export const removeToken = () => {
  localStorage.removeItem("token")
}

// 判断是否登录（核心方法）
export const isLogin = () => {
  return !!getToken()
}