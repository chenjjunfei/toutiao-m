<template>
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" size="mini" @click="onPost" :disabled="!message">
      发布
    </van-button>
  </div>
</template>

<script>
import { addCommentPost } from '@/api/comment'
export default {
  name: 'PostComment',
  data () {
    return {
      message: ''
    }
  },
  methods:{
    async onPost () {
      this.$toast.loading({
        message:'发布中',
        // 禁止背景点击
        forbidClick: true
      })
      // 找到数据接口
      const { data } = await addCommentPost({
        // 评论的目标id
        target: this.target.toString(),
        // 评论内容
        content: this.message,
        // 文章id
        art_id: this.articleId ? this.articleId.toString() : null
      })
      // 处理响应结果
      this.$emit('post-success', data.data.new_obj)
      this.$toast.success('发布成功')
      // 发布成功，清空输入框
      this.message = ''
    }
  },
  created () {},
  props:{
    target: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  watch:{},
  computed:{},
  components:{}
}

</script>
<style scoped lang='less'>
.post-comment{
  display: flex;
  align-items: center;
  padding: 14px;
  .post-btn{
    position: fixed;
    right: 0;
  }
}
</style>
