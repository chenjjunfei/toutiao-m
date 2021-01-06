import axios from 'axios'
// 非组件模块获取store必须通过这种方式
import store from '@/store/'
import JSONbig from 'json-bigint'
// axios()
// axios.get()
// axios.post()

// 创建一个 axios 实例，说白了就是复制了一个 axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: ' http://ttapi.research.itcast.cn/', // 请求的基础路径
  transformResponse: [function (data) {
    // 后端返回的数据可能不是JSON格式字符串
    // 如果不是的话，那么JSONbig.parse调用就会报错
    // 所以使用try-catch来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败，则进入这里
      // 把数据原封不动的直接返回给请求使用
      return data
    }
  }]
})
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state
  // 如果用户已登录，统一给用户设置token
  if (user) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 导出
export default request
