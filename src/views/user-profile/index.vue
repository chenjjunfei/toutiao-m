<template>
  <div class="user-profile">
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <van-cell title="头像" is-link center>
      <van-image
        width="30"
        height="30"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link></van-cell>
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
    ></van-cell>
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
    ></van-cell>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
export default {
  name: 'UserProfile',
  data () {
    return {
      // 用户数据
      user: {}
    }
  },
  methods:{
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    }
  },
  created () {
    this.loadUserProfile()
  },
  props:{},
  watch:{},
  computed:{},
  components:{}
}

</script>
<style scoped lang='less'>
</style>
