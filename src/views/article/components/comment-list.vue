<template>
  <div>
    <van-cell title="全部评论" />
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
      />
      <!-- <van-cell
        v-for="(comment, index) in list"
        :key="index"
        :title="comment.content"
      /> -->
    </van-list>
  </div>
</template>

<script>
import { getComment } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  methods:{
    async onLoad () {
    //  1. 请求获取数据
      const { data } = await getComment({
        // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        type: 'a',
        // 源id，文章id或评论id
        source: this.source,
        // 获取评论数据的偏移量，值为评论id，
        // 表示从此id的数据向后取，不传表示从第一页开始读取数据
        offset:this.offset,
        // 获取的评论数据个数，
        // 不传表示采用后端服务设定的默认每页数据量
        limit: this.limit
      })
      //  2. 把数据放到列表中
      const { results } = data.data
      this.list.push(...results)
      //  3. 将本次的loading 关闭
      this.loading = false
      //  4. 判断是否还有数据
      if (results.length) {
        //     如果有，更新获取下一页数据的页码
        this.offset = data.data.last_id
      } else {
        //  没有，则将finished设置为true，不在加载更多
        this.finished = true
      }
    }
  },
  created () {},
  props:{
    source: {
      type: [String, Number, Object],
      required: true
    }
  },
  watch:{},
  computed:{},
  components:{
    CommentItem
  }
}

</script>
<style scoped lang='less'>
</style>
