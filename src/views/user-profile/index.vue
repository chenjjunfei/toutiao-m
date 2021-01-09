<template>
  <div class="user-profile">
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <input type="file" hidden ref="file" accept="image/*" @change="onFileChange">
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image
        width="30"
        height="30"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isEditNameshow = true"
    ></van-cell>
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
      @click="isEditGendershow = true"
    ></van-cell>
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isEditBirthdayshow = true"
    ></van-cell>
    <!-- 修改昵称 -->
    <van-popup
      v-model="isEditNameshow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-name
        v-if="isEditNameshow"
        @close="isEditNameshow = false"
        :name="user.name"
        @update-name="user.name = $event"
      />
    </van-popup>
    <!-- 修改性别 -->
    <van-popup
      v-model="isEditGendershow"
      position="bottom"
    >
      <update-gender
        v-model="user.gender"
        @close="isEditGendershow = false"
      />
    </van-popup>
    <!-- 修改年月日 -->
    <van-popup
      v-model="isEditBirthdayshow"
      position="bottom"
    >
    <update-birthday
      v-if="isEditBirthdayshow"
      v-model="user.birthday"
      @close="isEditBirthdayshow = false"
    />
    </van-popup>
    <!-- 修改头像 -->
    <van-popup
      class="update-photo-color"
      v-model="isEditPhotoshow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-photo
        v-if="isEditPhotoshow"
        :file="previewImage"
        @update-photo="user.photo = $event"
        @close="isEditPhotoshow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  data () {
    return {
      // 用户数据
      user: {},
      // 控制修改昵称的弹出层
      isEditNameshow: false,
      // 控制修改性别的弹出层
      isEditGendershow: false,
      // 控制修改生日的弹出层
      isEditBirthdayshow: false,
      // 控制修改生日的弹出层
      isEditPhotoshow: false,
      // 上传预览图片
      previewImage: null
    }
  },
  methods:{
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onFileChange () {
      // 展示弹出层
      this.isEditPhotoshow = true
      // 在弹出层里预览图片，获取文件方法如下
      const file = this.$refs.file.files[0]
      this.previewImage = file
      // 为了解决相同文件不触发change，手动清空file里的valve
      this.$refs.file.value = ''
    }
  },
  created () {
    this.loadUserProfile()
  },
  props:{},
  watch:{},
  computed:{},
  components:{
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  }
}

</script>
<style scoped lang='less'>
.van-popup{
  background-color: #f5f7f9;
}
.update-photo-color{
  background-color: #000;
}
</style>
