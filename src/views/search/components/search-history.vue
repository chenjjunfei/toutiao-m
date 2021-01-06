<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div class="cell-item" v-if="isDeleteShow">
        <span @click="$emit('update-histories', [])">全部删除</span>
        &nbsp;
        &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in searchHistories"
      :key="index"
      @click="onDelete(history, index)"
    >
      <van-icon
        v-show="isDeleteShow"
        name="close"
      ></van-icon>
    </van-cell>
  </div>
</template>

<script>
// import { setItem } from '@/utils/storage'
export default {
  name: 'SearchHistory',
  data () {
    return {
      isDeleteShow: false
    }
  },
  // prrops 数据如果是引用类型（数组、对象） 可以修改，
  // 指的是：obj.name = 'a'、arr.push(123)、arr.splice(0, 1)
  // 但是任何的prop数据都不能重新赋值：xxx=xxx
  // 如果想要让Prop数据=新的数据，让父组件自己修改
  props:{
    searchHistories: {
      type: Array,
      required: true
    }
  },
  created () {},
  methods:{
    onDelete (history, index) {
      // 如果是删除操作，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        // 持久化处理
        // 1 修改本地存储数据
        // setItem('search-histories', this.searchHistories)  通过watch统一处理
        // 2 请求接口擅长线上数据
        return
      }
      this.$emit('search', history)
    }
  }
}

</script>
<style scoped lang="less">
</style>
