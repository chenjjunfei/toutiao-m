<template>
  <div class="comment-reply">
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon name="cross" slot="left" @click="$emit('close')" />
    </van-nav-bar>
    <!-- 当前评论项 -->
    <comment-item
      :comment="comment"
    />
    <!-- 所有评论回复 -->
    <comment-list
      :source="comment.com_id"
      type="c"
      :list="CommentList"
    />
        <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论
      </van-button>
    </div>
    <!-- 发布评论 -->
        <!-- 评论回复 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
     <post-comment
      :target="comment.com_id"
      :article-id="articleId"
      @post-success="onPostSuccess"
     />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'
export default {
  name: 'CommentReply',
  data () {
    return {
      isPostShow: false,
      // 评论的回复列表
      CommentList: []
    }
  },
  methods:{
    onPostSuccess (comment) {
      // 将发布成功的评论放到评论列表的顶部
      this.CommentList.unshift(comment)
      // 更新评论回复数量
      this.comment.reply_count++
      // 关闭发布回复的弹出层
      this.isPostShow = false
    }
  },
  created () {},
  props:{
    // 查看回复评论
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  watch:{},
  computed:{},
  components:{
    CommentItem,
    CommentList,
    PostComment
  }
}

</script>
<style scoped lang='less'>
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
    width: 200px;
    height: 30px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
}
</style>
