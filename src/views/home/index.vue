<template>
  <div class="home-container">
     <van-nav-bar
     class="app-nav-bar">
      <van-button class="search-btn" round slot="title" icon="search" type="info">搜索</van-button>
     </van-nav-bar>
  </div>
</template>

<script>
export default {

}

</script>
<style scoped lang="less">
.home-container{
  /deep/ .van-nav-bar__title{
    max-width:none
  }
  .search-btn{
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-button__text{
      font-size: 14px;
    }
    .van-icon{
      font-size: 16px;
    }
  }
}
</style>
