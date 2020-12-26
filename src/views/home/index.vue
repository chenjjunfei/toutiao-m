<template>
  <div class="home-container">
    <!-- 导航栏 -->
     <van-nav-bar
     class="app-nav-bar">
      <van-button class="search-btn" round slot="title" icon="search" type="info">搜索</van-button>
     </van-nav-bar>
     <!-- 文章频道列表   标签页组件有一个功能，只有第一次
     查看标签页的时候才会渲染里面的内容 -->
     <van-tabs v-model="active">
      <van-tab
      v-for="item in channels"
      :key="item.id"
      :title="item.name">
      <!-- 封装文章列表 -->
      <article-list :channel="item"/>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getChannels } from '@/api/user'
import articleList from './components/article-list.vue'
export default {
  components: { articleList },
  data () {
    return {
      active: 0,
      // 频道列表
      channels:[]
    }
  },
  created () {
    this.localChannels()
  },
  methods:{
    async localChannels(){
      // 请求获取频道数据
      const { data } = await getChannels()
      this.channels = data.data.channels
    }
  }
}

</script>
<style scoped lang="less">
.home-container{
  /deep/ .van-nav-bar__title{
    max-width:none
  }
  .search-btn{
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-button__text{
      font-size: 14px;
    }
    .van-icon{
      font-size: 16px;
    }
  }
}
</style>
