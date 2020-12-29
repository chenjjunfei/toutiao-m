<template>
  <div class="chinnel-edit">
    <van-cell center :border="false">
      <div slot="title" class="chinnel-title">我的频道</div>
      <van-button type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
      :icon="(isEdit && index !== 0) ? 'clear' : ''"
      class="grid-item"
      :class="{ active: index === active}"
       v-for="(channel, index) in userChannel"
       :key="index"
       :text="channel.name"
       @click="onUserChannelClick(channel, index)" />
    </van-grid>
    <van-cell center :border="false">
      <div slot="title" class="chinnel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
      class="grid-item"
      v-for="(channel, index) in recommendChannels"
      :key="index"
      :text="channel.name"
      @click="onAdd(channel)" />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels
} from '@/api/channels'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name:'ChannelEdit',
  data () {
    return {
      // 所有频道数据
      allChannels:[],
      // 设置编辑
      isEdit:false
    }
  },
  computed:{
    ...mapState(['user']),
    recommendChannels () {
      // 思路：所有频道 - 我的频道 = 剩下的推荐频道
      // filter 方法：过滤数据，根据方法返回的布尔值 true 来收集数据
      // filter 方法查找满足条件的所有元素
      return this.allChannels.filter(channel => {
        // 判断 channel 是否属于用户频道
        // find 方法查找满足条件的单个元素
        return !this.userChannel.find(userChannel => {
          // 找到满足该条件的元素
          return userChannel.id === channel.id
        })
      })
    }
  },
  props:{
    userChannel:{
      type: Array,
      required:true
    },
    active:{
      type: Number,
      required:true
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods:{
    async loadAllChannels () {
      const { data } = await getAllChannels()
      console.log(data)
      this.allChannels = data.data.channels
    },
    async onAdd (channel) {
      this.userChannel.push(channel)
      if (this.user) {
        // 登陆了，数据存储到线上
        await addUserChannels({
          channels:[
            { id: channel.id, seq: this.userChannel.length }
          ]
        })
      } else {
        setItem('user-channel', this.userChannel)
      }
    },
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index)
      }
    },
    async deleteChannel (channel, index) {
      // 如果删除的是当前频道之前的频道，索引值会发生变化，这里做一下判断
      if (index <= this.active) {
        this.$emit('update-active', this.active - 1)
      }
      this.userChannel.splice(index, 1)
      // 数据持久化
      if (this.user) {
        await deleteUserChannels(channel.id)
      } else {
        setItem('user-channel', this.userChannel)
      }
    },
    switchChannel (index) {
      this.$emit('update-active', index)
      this.$emit('close')
    }
  }
}

</script>
<style scoped lang="less">
.chinnel-edit{
  padding-top: 54px;
  .chinnel-title{
    font-size: 16px;
    color: #333333;
  }
  .grid-item{
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content{
      background-color: #f4f5f6;
      .van-grid-item__text{
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
  }
  /deep/ .van-grid-item__icon{
    position: absolute;
    right: -5px;
    top: -5px;
    font-size: 20px;
    color: #ccc;
  }
  .active{
    /deep/ .van-grid-item__text{
      color: red !important;
    }
  }
}
</style>
