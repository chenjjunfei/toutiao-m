<template>
  <div class="artcile-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <div class="article-wrap">
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
      <!-- 文章评论区域 -->
      <comment-list
        :source="articleId"
        :list="CommentList"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      />
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isShow = true"
      >写评论
      </van-button>
      <van-icon
        name="comment-o"
        :badge="totalCommentCount"
        color="#777"
      />
      <van-icon
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        :color="article.attitude ? 'skyblue' : '#777'"
        :name="article.attitude ? 'good-job' : 'good-job-o'"
        @click="onGood"
      />
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- 发布评论 -->
    <van-popup
      v-model="isShow"
      position="bottom"
    >
      <post-comment
        :target="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="replyComment"
        @close="isReplyShow = false"
        :article-id="articleId"
      />
    </van-popup>
  </div>
</template>

<script>
import './github-markdown.css'
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'
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
      isFollowLoading: false,
      // 收藏的loading状态
      isCollectLoading: false,
      // 点赞状态
      isGoodLoading: false,
      // 控制发布评论的显示状态
      isShow: false,
      // 文章评论列表
      CommentList: [],
      // 评论总数量
      totalCommentCount: 0,
      // 评论回复弹出层
      isReplyShow: false,
      // 当前回复评论对象
      replyComment:{}
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
    },
    async onCollect () {
      this.isCollectLoading = true
      if (this.article.is_collected) {
        // 已收藏，取消收藏
        await deleteCollect(this.articleId)
        this.article.is_collected = false
      } else {
      // 没有收藏，添加收藏
        await addCollect(this.articleId)
        this.article.is_collected = true
      }
      this.isCollectLoading = false
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    async onGood () {
      this.isGoodLoading = true
      if (this.article.attitude === 1) {
        // 已点赞，取消点赞
        await deleteLike(this.articleId)
        this.article.attitude = 0
      } else {
      // 没有点赞，添加点赞
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      this.isGoodLoading = false
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    },
    onPostSuccess (comment) {
      // 把发布成功的评论数据对象放到评论列表顶部
      this.CommentList.unshift(comment)
      // 更新评论的总数量
      this.totalCommentCount++
      this.isShow = false
    },
    onReplyClick (comment) {
      this.replyComment = comment
      // 展示回复内容
      this.isReplyShow = true
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
  components:{
    CommentList,
    PostComment,
    CommentReply
  }
}

</script>
<style scoped lang='less'>
.article-wrap{
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
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
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
}
</style>
