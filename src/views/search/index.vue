<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!--/ 搜索栏 -->
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow"
    :search-text="searchText"
    />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
     v-else-if="searchText"
     :search-text="searchText"
     @search="onSearch"
    />
    <!-- /联想结果 -->

    <!-- 搜索历史 -->
    <search-history
     v-else
     :search-histories="searchHistories"
     @search="onSearch"
     @update-histories="searchHistories = $event"
    />
    <!-- /搜索历史 -->
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getSearchHistories } from '@/api/search'
import { mapState } from 'vuex'
export default {
  name:'SearchIndex',
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: []
    }
  },
  computed:{
    ...mapState(['user'])
  },
  created () {
    this.loadSearchHistories()
  },
  methods:{
    onSearch (searchText) {
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText
      // 除去重复历史记录
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 删除重复项
        this.searchHistories.splice(index, 1)
      }
      // 把最新的搜索历史记录放到底部
      this.searchHistories.unshift(searchText)
      // 如果用户已登录，则把搜索历史记录存储到线上
      // 提示：只要我们调用获取搜索结果的数据接口，
      // 后端会给我们自动存储用户的搜索历史记录
      // 如果没有登录，则把搜索历史存储到本地
      // setItem('search-histories', this.searchHistories)通过watch统一处理
      // 展示搜索结果
      this.isResultShow = true
    },
    async loadSearchHistories () {
      const searchHistories = getItem('search-histories') || []
      // if (this.user) {
      //   const { data } = await getSearchHistories()
      //   // [...数组，...数组] 合并数组
      //   // 把Set转为数组 [...Set对象]
      //   // 数组去重 ：[...new Set([...数组, ...数组])]
      //   searchHistories = [...new Set([
      //     ...searchHistories,
      //     ...data.data.keywords
      //   ])]
      // }
      this.searchHistories = searchHistories
    }
  },
  props:{},
  watch:{
    // 监听搜索历史记录的变化，存储到本地存储
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  components:{
    SearchSuggestion,
    SearchHistory,
    SearchResult
  }
}

</script>
<style scoped>
</style>
