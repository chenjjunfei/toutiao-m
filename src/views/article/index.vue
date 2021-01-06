<template>
  <div class="artcile-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <h1 class="title">{{article.title}}</h1>
    <van-cell center class="user-info">
      <div slot="title" class="name">{{article.aut_name}}</div>
      <van-image
        class="avatar"
        slot="icon"
        fit="cover"
        round
        :src="article.aut_photo"
      />
      <div slot="label" class="pubdate">{{article.pubdate | relativeTime}}</div>
      <van-button
        round
        :icon="article.is_followed ? '' : 'plus'"
        size="small"
        class="follow-btn"
        :loading="isFollowLoading"
        @click="onFollow"
        :type="article.is_followed ? 'default' : 'info'"
      >{{article.is_followed ? '已关注' : '关注'}}
      </van-button>
    </van-cell>
    <div
     class="content markdown-body"
     v-html="article.content"
     ref="article-content"
    >
    </div>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
// 在组件中获取动态路由参数：
// 方式一：this.$route.params.xxx
// 方式二：props 传参
export default {
  name: 'ArticleIndex',
  data () {
    return {
      // 文章数据对象
      article:{},
      // 关注用户按钮loading状态
      isFollowLoading: false
    }
  },
  methods:{
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data
      // 数据改变影响视图更新（DOM数据) 不是立即的
      // 所以如果需要在修改数据之后马上操作该数据影响的视图DOM
      // 需要把这个代码放到$this.$nextTick中
      // 得到所有img标签
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
    },
    handlePerviewImage () {
      // 1.获取文章内容Dom容器
      const articleContent = this.$refs['article-content']
      // 2.得到所有img标签
      const imgs = articleContent.querySelectorAll('img')
      // 收集所有图片地址
      const imgPaths = []
      // 3.循环img列表，给img注册点击事件
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          // 4.在事件处理函数中调用ImagePreview()预览
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    async onFollow () {
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 已关注，取消关注
        await deleteFollow(this.article.aut_id)
        this.article.is_followed = false
      } else {
      // 没有关注，添加关注
        await addFollow(this.article.aut_id)
        this.article.is_followed = true
      }
      this.isFollowLoading = false
    }
  },
  created () {
    this.loadArticle()
  },
  props:{
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  watch:{},
  computed:{},
  components:{}
}

</script>
<style scoped lang='less'>
.title{
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}
.user-info{
  .avatar{
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name{
    font-size: 12px;
    color: #333333;
  }
  .pubdate{
    font-size: 12px;
    color: #b4b4b4;
  }
  .follow-btn{
    width: 85px;
    height: 29px;
  }
}
.markdown-body{
  padding: 14px;
  background-color: #fff;
}
</style>
