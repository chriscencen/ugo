<template>

  <view class="wrapper">
    <!-- 商品图片 -->
    <swiper class="pics" autoplay circular indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item :key="pic.goods_id" v-for="pic in goods.pics">
        <image :src="goods.pics_mid"></image>
      </swiper-item>
    </swiper>
    <!-- 基本信息 -->
    <view class="meta">
      <view class="price">￥{{goods.goods_price}}</view>
      <view class="name">{{goods.goods_name}}</view>
      <view class="shipment">快递: 免运费</view>
      <text class="collect icon-star">收藏</text>
    </view>
    <!-- 商品详情 -->
    <view class="detail">
      <!-- <view v-html="goods.goods_introduce"></view> -->
      <!-- rich-text 标签是小程序里面专门用来转化常规标签的,如h1,p  与上一行代码的效果一样 -->
      <rich-text :nodes="goods.goods_introduce"></rich-text>
    </view>
    <!-- 操作 -->
    <view class="action">
      <!-- 给button设置open-type="contact" 即可以开启客服功能 -->
      <button open-type="contact" class="icon-handset">联系客服</button>
      <text class="cart icon-cart" @click="goCart">购物车</text>
      <text class="add" @click="addCarts">加入购物车</text>
      <text class="buy" @click="createOrder">立即购买</text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 查询参数
        params: null,
        // 商品详情
        goods: null,
        // 购物车数据
        carts: uni.getStorageSync('carts') || []
      }
    },
    onLoad(params) {
      // console.log(params)
      this.params = params.id
      // 调用商品详情接口
      this.getGoodsDetail()
    },
    methods: {
      goCart () {
        uni.switchTab({
          url: '/pages/cart/index'
        })
        
      },
      createOrder () {
        uni.navigateTo({
          url: '/pages/order/index'
        })
      },
      // 商品详情接口
      async getGoodsDetail() {
        const {message} = await this.http({
          url: '/api/public/v1/goods/detail',
          data: {
            goods_id: this.params
          }
        })
        console.log(message)
        this.goods = message
      },
      // 点击添加购物车出发的事件
      addCarts() {
        // 本案例没有提供购物车接口,所以要把商品名称,价格,图片,数量存到本地存储中
        // 到购物车页面中可以再从本地存储中取出来渲染到页面上
        let {goods_id,goods_name,goods_price,goods_small_logo} = this.goods

        // 用变量flag 来标识是否找到相同的商品
        let flag = false
        // 将商品添加到本地存储之前先判断此商品是否已存在,如果已存在,只需要将此商品的数量加一
        this.carts.forEach((goods) => {
          if (goods.goods_id === goods_id){
            flag = true
            goods.goods_number += 1
          }
        })
        // 如果没有添加过那么可以将此商品添加到购物车列表中
        if (!flag) {
          this.carts.push({
            goods_id,
            goods_name,
            goods_price,
            goods_small_logo,
            goods_number:1,
            // 辅助数据
            goods_checked:true})
        }
        // 将购物车数据保存到本地存储
        uni.setStorageSync('carts', this.carts)
        // 提示框
        uni.showToast({title: '加入成功!'})
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 640rpx;
  }
  
  .meta {
    height: 250rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 20rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 24rpx;
      color: #999;

      position: absolute;
      right: 10rpx;
      top: 91rpx;
    }

    [class*="icon-"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 10rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;
    align-items: center;

    text {
      display: block;
    }

    .add, .buy {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 210rpx;
      text-align: center;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      text-align: center;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
    }

    [class*="icon"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 2rpx;
    }
  }
</style>
