<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      :default-index="defaultIndex"
      show-toolbar
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  data () {
    return {
      columns : ['男', '女'],
      defaultIndex: this.value
    }
  },
  methods:{
    onChange (picker, value, index) {
      this.defaultIndex = index
    },
    async onConfirm () {
      this.$toast.loading({
        message:'保存中',
        // 禁止背景点击
        forbidClick: true
      })
      // 请求提交更新用户性别
      await updateUserProfile({
        gender: this.defaultIndex
      })
      this.$toast.success('保存成功')
      // 同步修改父组件的性别
      this.$emit('input', this.defaultIndex)
      this.$emit('close')
    }
  },
  created () {},
  props:{
    value: {
      type: Number,
      required: true
    }
  },
  watch:{},
  computed:{},
  components:{}
}

</script>
<style scoped lang='less'>
</style>
