<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div class="cell-item">
        <span>全部删除</span>
        <span>完成</span>
      </div>
      <van-icon name="delete" />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in searchHistories"
      :key="index"
    >
      <van-icon name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props:{
    searchHistories: {
      type: Array,
      required: true
    }
  }
}

</script>
<style scoped>
</style>
