<template>
  <el-form ref="form" :model="query" label-width="200px" class="form box">
    <el-form-item label="总毛利率(由此得计算价)">
      <el-input v-model="query.totalProfit" :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item>
      <span>无分享</span>
    </el-form-item>
    <el-form-item label="无分享单上级一级分成率">
      <el-input v-model="query.noShareAloneOneLevelReward" :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="无分享多上级一级分成率">
      <el-input v-model="query.noShareMultipleOneLevelReward" :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="无分享多上级二级分成率">
      <el-input v-model="query.noShareMultipleTwoLevelReward" :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="无分享的用户返积分率">
      <el-input v-model="query.noShareUserIntegralReward" :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item>
      <span>有分享</span>
    </el-form-item>
    <el-form-item label="被动分享人返积分率">
      <el-input v-model="query.receiveShareUserIntegralReward" :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="主动分享人的分享率">
      <el-input v-model="query.initiateShareShareReward" :disabled="isChange"> </el-input>
    </el-form-item>
    <el-form-item label="主动分享人单上级一级分成率">
      <el-input v-model="query.initiateShareAloneOneLevelReward" :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="isChange = !isChange">打开修改</el-button>
      <el-button type="primary" @click="handleChange">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

    export default {
        name: "amountShare",
        data(){
          return{
              isChange:true,
              query:{
                  totalProfit:'',
                  noShareAloneOneLevelReward:'',
                  noShareMultipleOneLevelReward:'',
                  noShareMultipleTwoLevelReward:'',
                  noShareUserIntegralReward:'',
                  receiveShareUserIntegralReward: '',
                  initiateShareShareReward: '',
                  initiateShareAloneOneLevelReward: ''
              }
          }
        },
        mounted() {
            this.getList()
        },
        methods:{
            async getList(){
              this.$http({
                url: this.$http.adornUrl(`/businessCommodityGlobalAmountDivide/find`),
                method: 'get',
                params: this.$http.adornParams({

                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.query = data.result
                } else {
                  this.$message.error(data.msg);
                }
              })
            },
            handleChange(){
              this.$http({
                url: this.$http.adornUrl(`/businessCommodityGlobalAmountDivide/update`),
                method: 'post',
                params: this.$http.adornParams(this.query)
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                  this.isChange = true
                } else {
                  this.$message.error(data.msg);
                }
              })
            }
        }
    }
</script>

<style scoped>
.form{
    margin-top: 20px;
    width: 700px;
    /*margin-left: 20%;*/
}
</style>
