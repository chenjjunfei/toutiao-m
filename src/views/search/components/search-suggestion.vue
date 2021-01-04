<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(item, index) in suggestions"
      :key="index"
      @click="$emit('search', item)"
    >
    <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  data () {
    return {
      // 联想建议数据列表
      suggestions: []
    }
  },
  created () {},
  methods:{
    highlight (item) {
      return item.replace(
        new RegExp(this.searchText, 'gi'),
      `<span style="color: red">${this.searchText}
      </span>`
      )
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  computed: {},
  components: {},
  watch: {
    // 属性名：要监视的数据的名称
    searchText: {
      handler: debounce(async function () {
        // 找到数据接口
        // 请求获取数据
        // 模板绑定展示
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 500),
      // 该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  }
}

</script>
<style scoped>
</style>
