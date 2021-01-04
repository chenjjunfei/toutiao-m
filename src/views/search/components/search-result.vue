<template>
  <div class="search-result">
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-cell v-for="(item, index) in list" :key="index" :title="item.title" />
  </van-list>
  </div>
</template>

<script>
import { getSearchResualt } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      // 页码
      page: 1,
      // 每页大小
      perPage: 10
    }
  },
  props:{
    searchText: {
      type: String,
      required: true
    }
  },
  methods:{
    async onLoad () {
      // 1请求获取数据
      const { data } = await getSearchResualt({
        page: this.page,
        per_page: this.perPage,
        q: this.searchText
      })
      // 2将数据放到数据列表中
      const { results } = data.data
      this.list.push(...results)
      // 3关闭本次的loading
      this.loading = false
      // 4判断是否还有数据
      if (results.length) {
        this.page++
      } else {
      // 如果有，则更新获取下一页数据的页码
      // 如果没有，则把finish设置为true，关闭加载更多
        this.finished = true
      }
    }
  }
}

</script>
<style scoped lang="less">
.search-result{
  position: fixed;
  right: 0;
  left: 0;
  top: 54px;
  bottom: 0;
  overflow-y: auto;
}
</style>
