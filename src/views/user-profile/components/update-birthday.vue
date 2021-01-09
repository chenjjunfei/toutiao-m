<template>
  <div update-birthday>
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  data () {
    return {
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(this.value)
    }
  },
  methods:{
    async onConfirm () {
      this.$toast.loading({
        message:'保存中',
        // 禁止背景点击
        forbidClick: true
      })
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      // 请求提交更新用户生日
      await updateUserProfile({
        birthday: date
      })
      this.$toast.success('保存成功')
      // 同步修改父组件的生日
      this.$emit('input', date)
      this.$emit('close')
    }
  },
  created () {},
  props:{
    value: {
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
</style>
