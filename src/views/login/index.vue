<template>
  <div class="login-container">
    <van-nav-bar
    class="app-nav-bar"
  title="登录 / 注册"
  left-arrow
  @click-left="$router.back()"
/>
<van-form @submit="onLogin" :show-error='false' :show-error-message='false' ref="formRef" validate-first @failed="onFailed">
  <van-field
    v-model="user.mobile"
    name="mobile"
    icon-prefix="toutiao"
    left-icon="shouji"
    center
    placeholder="请输入手机号"
    :rules="formRulse.mobile"
  />
  <van-field
    v-model="user.code"
    clearable
    center
    name="code"
    icon-prefix="toutiao"
    left-icon="yanzhengma"
    placeholder="请输入验证码"
    :rules="formRulse.code"
  >
  <template #button>
    <van-count-down :time="1000*60" v-if="isCountDownShow" format="ss s" @finish="isCountDownShow=false"/>
    <van-button class="sent-btn" v-else size="mini" :loading="isSendSmsLoading" @click.prevent="onSendSms" round>发送验证码</van-button>
    </template>
  </van-field>
  <div class="login-btn-wrap">
    <van-button class="login-btn" type="info" block>登录</van-button>
  </div>
</van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'
export default {
  name:'LoginIndex',
  data(){
    return {
      user:{
        mobile:'',
        code:''
      },
      formRulse:{
        mobile:[
          { required: true, message: '请填写手机号' },
          { pattern:  /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式' }
        ],
        code:[
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ]
      },
      // 控制倒计时与发送按钮显示
      isCountDownShow:false,
      // 控制发送按钮loading显示
      isSendSmsLoading:false
    }
  },
  created(){

  },
  methods:{
    async onLogin(){
      Toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration:0
      })
      try {
        const { data } = await login(this.user)
        Toast.success('登陆成功')
        // 将后端返回的用户登录状态（token等数据）放到Vuex容器中
        this.$store.commit('setUser', data.data)
        this.$router.back()
      } catch (err) {
        Toast.fail('登录失败')
      }
    },
    onFailed(error){
      if (error.errors[0]){
        Toast({ message:error.errors[0].message, position : 'top' })
      }
    },
    async onSendSms(){
      try {
        await this.$refs.formRef.validate('mobile')
        await sendSms(this.user.mobile)
        this.isSendSmsLoading = true
        // 验证码发送成功
        this.isCountDownShow = true
      } catch (err){
        let message = ''
        if (err && err.response && err.response.status === 429){
          // 发送短信失败的错误提示
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        Toast({ message, position : 'top' })
      }
      this.isSendSmsLoading = false
    }
  }

}

</script>
<style scoped lang='less'>
.login-container{
  .sent-btn{
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text{
      font-size: 11px;
      color: #666666;
    }
  }
.login-btn-wrap{
  padding: 26px 16px;
  .login-btn{
  color: #6db4fb;
  border: none;
  .van-button__text{
    font-size: 15px;
    color: #fff;
  }
}
}
}
</style>
