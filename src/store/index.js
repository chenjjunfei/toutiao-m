// import { from } from 'core-js/fn/array'
import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem('user')
    // JSON.parse(window.localStorage.getItem('user'))
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，把数据放到本地存储中，仅为了持久化数据
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem('user', state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
