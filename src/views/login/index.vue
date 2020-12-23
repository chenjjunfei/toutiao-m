<template>
  <div class="login-container">
    <van-nav-bar
    class="app-nav-bar"
  title="登录 / 注册"
  left-arrow
  @click-left="$router.back()"
/>
<van-cell-group>
  <van-field
    v-model="user.mobile"
    left-icon="shouji"
    placeholder="请输入手机号"
  > <van-icon class="iconfont iconshouji" slot="left-icon"></van-icon>
  </van-field>
  <van-field
    v-model="user.code"
    clearable
    left-icon="iconyanzhengma"
    placeholder="请输入验证码"
  >
  <van-icon class="iconfont iconyanzhengma" slot="left-icon"></van-icon>
  <template #button>
    <van-button class="sent-btn" size="mini" round>发送验证码</van-button>
    </template>
  </van-field>
</van-cell-group>
<div class="login-btn-wrap">
<van-button class="login-btn" type="info" block @click="onLogin">登录</van-button>
</div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { Toast } from 'vant'
export default {
  data(){
    return {
      user:{
        mobile:'',
        code:''
      }
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
        const res = await login(this.user)
        console.log(res)
        Toast.success('登陆成功')
      } catch (err) {
        console.log(err)
        Toast.fail('登录失败')
      }
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
