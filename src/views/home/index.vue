<template>
  <div class="home-container">
    <!-- 导航栏 -->
     <van-nav-bar
     class="app-nav-bar">
      <van-button class="search-btn" round slot="title" icon="search" type="info" to="/search">搜索</van-button>
     </van-nav-bar>
     <!-- 文章频道列表   标签页组件有一个功能，只有第一次
     查看标签页的时候才会渲染里面的内容 -->
     <van-tabs class="channels-tabs" v-model="active">
      <van-tab
      v-for="item in channels"
      :key="item.id"
      :title="item.name">
      <!-- 封装文章列表 -->
      <article-list :channel="item"/>
      </van-tab>
      <!-- 给汉堡按钮占位用 -->
      <div slot="nav-right" class="wrap-nav-it"></div>
      <div slot="nav-right" class="wrap-nav"
      @click="isChannelShow = true">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <van-popup
      class="channel-popup"
      v-model="isChannelShow"
      position="bottom"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%">
      <channel-edit
        :active="active"
        :user-channel="channels"
        @close="isChannelShow=false"
        @update-active="updateActiveShow"
      />
      </van-popup>
  </div>
</template>

<script>
import { getChannels } from '@/api/user'
import articleList from './components/article-list.vue'
import ChannelEdit from './components/chinnel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  components: { articleList, ChannelEdit },
  data () {
    return {
      active: 0,
      // 频道列表
      channels:[],
      // 控制编辑频道的显示状态
      isChannelShow:false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.localChannels()
  },
  methods:{
    async localChannels(){
      // 请求获取频道数据
      // const { data } = await getChannels()
      // this.channels = data.data.channels
      let channels = []
      if (this.user) {
        // 已登录，请求获取线上的用户频道列表数据
        const { data } = await getChannels()
        channels = data.data.channels
      } else {
        // 没有登录，判断是否有本地存储的频道列表数据
        const localChannels = getItem('user-channel')
        // 如果有本地存储的频道列表则使用
        if (localChannels) {
          channels = localChannels
        } else {
          // 用户没有登录，也没有本地存储的频道，那就请求获取默认推荐的频道列表
          const { data } = await getChannels()
          channels = data.data.channels
        }
      }
      // 把处理好的数据放到 data 中以供模板使用
      this.channels = channels
    },
    updateActiveShow (index) {
      this.active = index
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
  .channels-tabs{
    /deep/ .van-tab{
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line{
      width: 15px !important;
      height: 3px;
      background: #3296fa;
      bottom: 20px;
    }
    .wrap-nav{
      position: fixed;
      right: 0;
      width: 33px;
      height: 43px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: .9;
      .van-icon{
        font-size: 24px;
      }
      &:before{
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 1px;
        height: 43px;
        background: url('./leftline.png') no-repeat;
        background-size: contain;
      }
    }
    .wrap-nav-it{
      width: 33px;
      flex-shrink: 0;
    }
  }
}
</style>
