<template>
  <view class="tips" v-if="loaded && !goodsList.length">没有找到相关商品~</view>
  <view v-else>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    <scroll-view class="goods" scroll-y @scrolltolower="getMore">
      <view class="item" @click="goDetail" :key="goods.goods_id" v-for="goods in goodsList">
        <!-- 商品图片 -->
        <image class="pic" :src="goods.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{goods.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{goods.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 查询参数
        query: null,
        // 商品列表
        goodsList: [],
        // 商品总数
        total: 0,
        // 商品页数
        pagenum: 1,
        // 商品每页展示的条数
        pagesize: 5,
        // 是否请求完成
        loaded: false
      }
    },
    onLoad(params) {
      // 通过onLoad函数可以获取到地址中的参数
      console.log(params.query)
      this.query = params.query
      this.getGoodsList()
    },
    methods: {
      goDetail () {
        uni.navigateTo({
          url: '/pages/goods/index'
        })
      },
      // 获取商品列表
      async getGoodsList() {
        const {message} = await this.http({
          url:"/api/public/v1/goods/search",
          data: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        console.log(message)
        // concat用于连接每次请求回来的数据数组,让第一页,第二页...拼接起来
        this.goodsList = this.goodsList.concat(message.goods)
        this.total = message.total
        this.loaded = true
      },
      // 用户快要划到底部时,上啦页面,请求 更多数据
      getMore() {
        console.log('快到底部啦')
        // 如果所有的数据都请求回来了,那么直接跳出函数,即使再上拉也不会继续请求,提高性能
        if (this.goodsList.length === this.total) return;
        // 当快划到底部时让请求的页数加一,并重新发起请求
        this.pagenum += 1;
        this.getGoodsList()
      }
    }
  }
</script>

<style scoped lang="scss">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    /* #ifdef H5 */
    position: relative;
    z-index: 99;
    /* #endif */

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }
  }
</style>
