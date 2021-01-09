<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onClickRight"
    />
    <div class="name-wrap">
      <van-field
      v-model="localName"
      rows="2"
      autosize
      type="textarea"
      maxlength="7"
      placeholder="请输入昵称"
      show-word-limit
    />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  data () {
    return {
      localName: this.name
    }
  },
  methods:{
    async onClickRight () {
      this.$toast.loading({
        message:'保存中',
        // 禁止背景点击
        forbidClick: true
      })
      try {
      // 请求提交更新用户昵称
        await updateUserProfile({
          name: this.localName
        })
        this.$toast.success('保存成功')
        // 同步修改父组件的昵称
        this.$emit('update-name', this.localName)
        this.$emit('close')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast('昵称已存在')
        }
      }
    }
  },
  created () {},
  props:{
    name: {
      type: String,
      required: true
    }
  },
  watch:{},
  computed:{},
  components:{}
}

</script>
<style scoped lang='less'>
.name-wrap{
  padding: 10px;
}
</style>
