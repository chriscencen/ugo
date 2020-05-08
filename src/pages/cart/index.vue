<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <block v-if="address">
      <view class="shipment">
      <view class="dt">收货人: </view>
      <view class="dd meta">
        <text class="name">{{address.userName}}</text>
        <text class="phone">{{address.telNumber}}</text>
      </view>
      <view class="dt">收货地址:</view>
      <view class="dd">{{detailAddress}}</view>
    </view>
    </block>
    <view v-else>
      <button type="primary" @click="addAdress">添加地址</button>
    </view>
    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>
        <view class="goods" :key="goods.goods_id" v-for="(goods,index) in cartList">
          <!-- 商品图片 -->
          <image class="pic" :src="goods.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{goods.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{goods.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @click="changeNumber(index,-1)">-</text>
              <input type="number" :value="goods.goods_number" class="number" @blur="inputEvent($event,index)">
              <text class="plus" @click="changeNumber(index,1)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <icon type="success" size="20" :color="goods.goods_checked ? '#ea4451' : '#ccc'" @click="toggle(index)"></icon>
          </view>
        </view>
      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon type="success" :color="all ? '#ea4451':'#ccc'" size="20" @click="checkedAll"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{acount}}</label><text>.00</text>
      </view>
      <view class="pay" @click="amount">结算({{checkedGoods.length}})</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 购物车列表数据
        cartList: [],
        // 单选框的选中状态
        // checked: true,
        // 收货地址
        address: null
      }
    },
    onLoad() {
      // 条用获取购物车接口
      this.getCartList()
    },
    methods: {
      getCartList() {
        // 因为本案例没有购物车接口,所以在商品详情页面已经将商品相关的
        // 名称,价格等信息已存储到本地存储中,直接到本地存储中取即可
        this.cartList = uni.getStorageSync('carts')
        // console.log(this.cartList)
      },
      // 改变商品数量
      changeNumber(index,step) {
        // 设置数量边界值
        if (step === -1 && this.cartList[index].goods_number<= 1) return
        // 因为此案例中没有后端提供的购物车数据,也没有库存信息,此处可以假设最大数量为10
        if (step === 1 && this.cartList[index].goods_number>= 10) return
        this.cartList[index].goods_number += step
        // 将所做的改变存储到本地
        uni.setStorageSync('carts',this.cartList)
      },
      // 当input输入框失去焦点时
      inputEvent (event,index) {
        // console.log(event.detail.value,index)
        // 如果用户在输入框中输入的值超出了临界值,强行将值改为临界值
        if (event.detail.value <=1 ) {
          this.cartList[index].goods_number = 1
        }
        if(event.detail.value >=10 ) {
         this.cartList[index].goods_number = 10
        }
        // 将所做的改变存储到本地
        uni.setStorageSync('carts',this.cartList)
      },
      // 点击商品前的单选框切换选中状态
      toggle (index) {
        this.cartList[index].goods_checked = !this.cartList[index].goods_checked
        // 将所做的改变存储到本地
        uni.setStorageSync('carts',this.cartList)
      },
      // 点击全选按钮,选中购物车中的所有商品
      checkedAll () {
        this.cartList.forEach(goods => {
          goods.goods_checked = true
        })
        // 将所做的改变存储到本地
        uni.setStorageSync('carts',this.cartList)
      },
      // 点击按钮添加地址
      addAdress () {
        uni.chooseAddress({
          success:(res) =>{
            console.log(res)
            this.address = res
          }
        })
      },
      // 点击结算按钮触发的事件
      amount () {
        // 1.结算前先判断是否有收货地址,如果没有直接跳出函数,并提醒用户
        if (!this.address) return uni.showToast({title:'请填写收货地址~'})
        // 2.并判断用户是否至少选择了一件商品
        if (!this.checkedGoods.length) return uni.showToast({title:'请至少选择一件商品~'})
        // 3.判断用户是否已经登录
        if (!uni.getStorageSync('token')) {
          return uni.navigateTo({
            url: '/pages/auth/index'
          })
        }
        // 在登录页面成功登陆后退回到购物车页面
        //发起请求生成订单
      }
    },
    computed: {
      // 筛选出处于选中状态的商品
      checkedGoods () {
        return this.cartList.filter(goods => {
          return goods.goods_checked
        })
      },
      // 监听全选按钮的选中状态
      all() {
        return this.cartList.length === this.checkedGoods.length
      },
      // 计算总金额
      acount() {
        let total = 0
        this.checkedGoods.forEach(goods => {
          total += goods.goods_number * goods.goods_price
        })
        return total
      },
      // 拼接详细地址
      detailAddress () {
         return this.address && [this.address.provinceName,
         this.address.cityName,
         this.address.countyName,
         this.address.detailInfo].join('')
      }
      // 监听选中商品总数
      // count() {
      //   let total = 0
      //   return this.checkedGoods.forEach(goods => {
      //     total += goods.goods_number
      //   })
      //   return total
      // }
    }
  }
</script>

<style scoped lang="scss">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

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

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

