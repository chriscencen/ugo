<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="login">微信登录</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        code: ''
      }
    },
    onLoad() {
      // 页面一加载时调用Api  uni.getSetting()检测是否授权
      uni.getSetting({
        success: (res) => {
          console.log(res.authSetting['scope.userInfo'])
          // 如果已授权那么就调用接口uni.getUserInfo() 获取用户信息
          if (res.authSetting['scope.userInfo']) {
            uni.getUserInfo({
              success: (res) => {
                console.log(res)
                this.getToken(res)
              }
            })
          }
        }
      })
    },
    methods: {
      // 获取登录请求的参数(用户信息)
      getUserInfo(ev) {
        // 获取请求code值
        uni.login({
          success: (res) => {
            console.log(res.code)
            this.code = res.code
          }
        })
        console.log(ev.detail)
        this.getToken(ev.detail)
      },
      // 因为不管是调用接口获取用户信息,还是通过事件获取用户信息都需要发请求获取token,所以将发送请求获取token封装成一个方法
      async getToken (params) {
        console.log(params)
        const {encryptedData,iv,rawData,signature} = params
        // 发起请求
        const {message} = await this.http({
          url: '/api/public/v1/users/wxlogin',
          data: {
            code: this.code,
            encryptedData,
            iv,
            rawData,
            signature
          }
        })
        console.log(message)  
        // 本案例因研发课程的老师的APPid和我们自己的不一样所以无法成功请求后面的步骤无法完成

        // 将获取到的token 保存到本地
        // uni.setStorageSync('token', message.token) 
        // 然后回退一步到购物车页面
        // uni.navigateBack()     
      }
    }
  }
</script>

<style lang="scss" scoped>
  button {
    width: 600rpx;
    margin: 200rpx auto 0;
  }
</style>