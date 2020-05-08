<template>
  <view>
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <!-- 只有请求到了数据,数据的长度不为0时,才显示渲染分类的盒子 -->
    <view class="category" v-if="categoryList.length">
      <!-- 顶级分类 -->
      <view class="sup">
        <scroll-view scroll-y>
          <text :key="top.cat_id" v-for="(top,i) in categoryList" @click="changeCategory(i)" :class="{'active': currentIndex === i}">{{top.cat_name}}</text>
        </scroll-view>
      </view>
      <!-- 子级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>
          <view class="children" :key="chlid.cat_id" v-for="chlid in categoryChild">
            <view class="title">{{chlid.cat_name}}</view>
            <!-- 品牌 -->
            <view class="brands">
              <navigator url="/pages/list/index" :key="i" v-for="(brand,i) in chlid.children">
                <image :src="brand.cat_icon"></image>
                <text>{{brand.cat_name}}</text>
              </navigator>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {
    data() {
      return {
        // 商品分类列表
        categoryList: [],
        // 当前一级分类的索引
        currentIndex: 0
      }
    },
    
    components: {
      search
    },
    onLoad() {
      // 调用分类数据接口
      this.getTopCategories()
    },
    methods: {
      // 分类数据接口
      async getTopCategories() {
        const { message } = await this.http({
          url: '/api/public/v1/categories'
        })
        console.log(message);
        this.categoryList = message
      },
      // 点击切换一级分类,显示对应的二级分类
      changeCategory(index) {
        // console.log(index);
        this.currentIndex = index
      }
    },
    computed: {
      categoryChild() {
        return this.categoryList.length && this.categoryList[this.currentIndex].children
      }
    }
  }
</script>

<style scoped lang="scss">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
