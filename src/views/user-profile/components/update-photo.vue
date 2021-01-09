<template>
  <div class="update-photo">
    <img class="image" :src="image" alt="">
    <van-nav-bar
      class="botobar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdatePhoto',
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      // 裁切器实例
      cropper: null
    }
  },
  methods:{
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message:'保存中',
        // 禁止背景点击
        forbidClick: true,
        // 展示时间，0表示持续展示
        duration: 0
      })
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      // 如果要求 Content-type是 multipart /form-data
      // 则一定要提交 FormData数据对象，专门用于文件上传的
      // 不能提交{}，没有
      // const fd = new FormData()
      // fd.append('photo', this.file)
      await updateUserPhoto(fd)
      this.$toast.success('保存成功')
      // 同步修改父组件的头像
      this.$emit('update-photo', window.URL.createObjectURL(file))
      this.$emit('close')
    }
  },
  created () {},
  props:{
    file: {
      // type: Object,
      required: true
    }
  },
  watch:{},
  computed:{},
  components:{},
  mounted () {
    // 获取需要裁切的Dom
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  }
}

</script>
<style scoped lang='less'>
.botobar{
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #000;
}
/* Ensure the size of the image fit the container perfectly */
.image {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
