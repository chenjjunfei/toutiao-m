<template>
  <div class="article-list">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="refershSuccessText" :success-duration="1500">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item v-for="(item, index) in articles" :key="index" :article="item"/>
        <!-- <van-cell v-for="(item, index) in articles" :key="index" :title="item.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name:'ArticleList',
  data () {
    return {
      // 文章列表
      articles: [],
      // 控制加载中的状态
      loading: false,
      // 控制加载结束状态
      finished: false,
      // 获取下一页数据的时间戳
      timestamp:null,
      // 控制下拉刷新
      isLoading: false,
      // 刷新成功提示
      refershSuccessText: ''
    }
  },
  components:{ ArticleItem },
  created () {

  },
  methods:{
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id:this.channel.id,
        timestamp:this.timestamp || Date.now(),
        with_top:1
      })
      // 2.把数据放到list中
      const { results } = data.data
      this.articles.push(...results)
      // 3.设置本次加载状态结束，判断是否需要加载下一次，否则就会永远停在这里
      this.loading = false
      // 4.数据全部加载完成,加载下一页
      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    async onRefresh () {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id:this.channel.id,
        timestamp:Date.now(),
        with_top:1
      })
      const { results } = data.data
      this.articles.unshift(...results)
      this.isLoading = false
      this.refershSuccessText = `更新了${results.length}条数据`
    }
  },
  props: {
    channel:{
      type: Object,
      required:true
    }
  }
}

</script>
<style scoped lang="less">
.article-list{
  position: fixed;
  right: 0;
  left: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
