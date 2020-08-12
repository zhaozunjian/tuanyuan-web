<template>
  <el-form
    :model="commodity"
    ref="commodity"
    label-width="110px"
  >
    <el-form-item label="所属商家名称" prop="businessName">
      <span>{{ commodity.businessName }}</span>
    </el-form-item>
    <el-form-item label="所属商家分类" prop="businessCategoryName">
      <span>{{ commodity.businessCategoryName }}</span>
    </el-form-item>
    <el-form-item label="所属商品分类" prop="businessCommodityCategoryName">
      <span>{{ commodity.businessCommodityCategoryName }}</span>
    </el-form-item>
    <el-form-item label="商品名称" prop="businessCommodityName">
      <span>{{ commodity.businessCommodityName }}</span>
    </el-form-item>
    <el-form-item label="商品描述" prop="businessCommodityDescription">
      <span>{{ commodity.businessCommodityDescription }}</span>
    </el-form-item>
    <el-form-item label="详情url" prop="detailContentUrl">
      <span>{{ commodity.detailContentUrl }}</span>
    </el-form-item>
    <el-form-item label="推荐权重值">
      <span>{{ commodity.priority }}</span>
    </el-form-item>
    <el-form-item label="合作价(商户所得价)">
      <span>{{ commodity.costPrice }}</span>
    </el-form-item>
    <el-form-item label="售价(用户购买价)">
      <span>{{ commodity.currentPrice }}</span>
    </el-form-item>
    <el-form-item label="原价(灰色的价格)">
      <span>{{ commodity.originPrice }}</span>
    </el-form-item>
    <el-form-item label="是否开启库存限制">
      <span v-if="commodity.openStock==1">开启</span>
      <span v-if="commodity.openStock==2">不开启(无限库存)</span>
    </el-form-item>
    <el-form-item label="库存数量" v-show="commodity.openStock==1">
      <span>{{ commodity.stockCount }}</span>
    </el-form-item>
    <el-form-item label="详情内容">
      <span>{{ commodity.detailText }}</span>
    </el-form-item>
    <el-form-item label="购买须知">
      <span>{{ commodity.noticeText }}</span>
    </el-form-item>
    <el-form-item label="商品头像">
      <img v-if="commodityAvatar" :src="commodityAvatar" class="commodityAvatar" />
    </el-form-item>
    <el-form-item label="商品海报">
      <img v-if="commodityPost" :src="commodityPost" class="commodityPost" />
    </el-form-item>
    <el-form-item label="轮播图走马灯">
      <el-row>
        <img
          width="200"
          height="200"
          v-for="(carouselImagesUrlItem, index) in commodity.carouselImagesUrlList"
          :key="index"
          :src="imageServerUrl + carouselImagesUrlItem"
          class="carouselImages"
        />
        &nbsp;
      </el-row>
    </el-form-item>
    <el-form-item label="商品详情图片">
      <el-row>
        <img
          v-for="(detailUrlItem, index) in commodity.detailUrlList"
          :key="index"
          :src="imageServerUrl + detailUrlItem"
          class=" detailUrlImages"
        />
        &nbsp;
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";
export default {
  data() {
      return {
          imageServerUrl: SERVER_CONSTANT.imageServerUrl,
          imageHttpsServerUrl: SERVER_CONSTANT.imageHttpsServerUrl,
          commodityAvatar: '',
          commodityPost: '',
          commodity: {}
      }
  },
  created() {
      this.initData()
  },
  methods: {
    initData() {
        this.initBusinessCommodity()
    },
    initBusinessCommodity() {
        let businessCommodityId = this.$route.query.businessCommodityId
      if (this.$route.query.businessCommodityId){
        this.$http({
          url: this.$http.adornUrl(`/businessCommodity/info`),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityId: businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.commodity = data.result
            this.commodityAvatar = SERVER_CONSTANT.imageServerUrl + data.result.businessCommodityAvatar
            this.commodityPost = SERVER_CONSTANT.imageHttpsServerUrl + data.result.businessCommodityPoster
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    }
  }
};
</script>

<style>

</style>
