<template>
  <view :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll" />
    <!-- 焦点图 -->
    <swiper class="banner" autoplay circular interval="3000" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item :key="slide.goods_id" v-for="slide in slideList">
        <navigator :url="'/pages/goods/index?id=' + slide.goods_id" >
          <image :src="slide.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 将button的open-type属性值设置为share 可以分享当前页面 -->
    <!-- <button type="primary" open-type="share">转发</button> -->
    <!-- 导航条 -->
    <view class="navs">
      <navigator 
      :open-type=" nav.open_type || 'navigate' "  
      :key="i" 
      v-for="(nav,i) in navList"
      :url="nav.open_type ? '/pages/category/index':'/pages/list/index?query=' + nav.name">
        <image :src="nav.image_src"></image>
      </navigator>
    </view>
    <!-- 楼层 -->
    <view class="floors">
      <view class="floor" :key="i" v-for="(floor,i) in floorList">
        <view class="title">
          <image :src="floor.floor_title.image_src"></image>
        </view>
        <view class="items">
          <navigator :url="'/pages/list/index?query='+product.name" :key="index" v-for="(product,index) in floor.product_list">
            <image :src="product.image_src"></image>
          </navigator>
        </view>
      </view>
    </view>
    <!-- 回到顶部 -->
    <view class="goTop icon-top" @click="goTop" v-if="scrollTop > 200"></view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {

    data () {
      return {
        // 页面高度
        pageHeight: 'auto',
        // 轮播图数据列表
        slideList: [],
        // 主导航列表
        navList: [],
        // 楼层数据列表
        floorList: [],
        // 页面距离顶部的距离
        scrollTop: 0
      }
    },

    components: {
      search
    },

    onLoad() {
      // 调用轮播图接口
      this.getSlide()
      // 调用主导航接口
      this.getNav()
      // 调用楼层接口
      this.getFloor()
    },
    // 监听用户下拉事件
    async onPullDownRefresh() {
      // 用户下拉页面时重新发起请求
      // 调用轮播图接口
      await this.getSlide()
      // 调用主导航接口
      await this.getNav()
      // 调用楼层接口
      await this.getFloor()
      uni.stopPullDownRefresh()
    },
    
    methods: {
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },
      // 轮播图接口
      async getSlide() {
        const {message} = await this.http({
          url: '/api/public/v1/home/swiperdata'
        })
        // console.log(message)
        this.slideList = message
      },
      // 主导航接口
      async getNav() {
        const {message} = await this.http({
          url: '/api/public/v1/home/catitems'
        })
        // console.log(message)
        this.navList = message
      },
      // 楼层接口
      async getFloor() {
        const {message} = await this.http({
          url: '/api/public/v1/home/floordata'
        })
        // console.log(message)
        this.floorList = message
      },
      // 点击顶部按钮回到顶部
      goTop() {
        uni.pageScrollTo({
          scrollTop: 0
        })
      },
      // 监听页面滚动事件
      onPageScroll(ev) {
        // console.log(ev)
        this.scrollTop = ev.scrollTop
      },
      // 监听用户的转发操作,自定义准发的图片,文字等信息
      onShareAppMessage() {
      return {
        title: '西门少年好好听,快来听听吧~~~',
        path: 'pages/index/index',
        imageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586107651520&di=59dd76f7187e49a0b564546f05d9f12a&imgtype=0&src=http%3A%2F%2Fupload.taihainet.com%2F2016%2F1123%2F1479833026336.jpg'
    }
  }
    }
  }
</script>

<style scoped lang="scss">
  .banner {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding: 20rpx 0 0 8rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      navigator {
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      navigator:first-child {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0rpx;
      }

      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
      }
    }

    &:first-child {

      .items {

        navigator {
          width: 233rpx;
        }
      }
    }
  }

  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;
  
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>