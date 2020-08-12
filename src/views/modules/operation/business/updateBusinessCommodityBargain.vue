<template>
  <div class="fillcontain">
    <el-row class="chooseTip">
        <el-col :span="24">
            <span>所选择的商品名称: {{this.businessCommodityName}}</span>
        </el-col>
    </el-row>
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item>
            <el-row>
                <el-col :span="4">
                    <span>设置的最大砍价人数: {{this.maxBargainNumber}}</span>
                </el-col>
                <el-col :span="4">
                    <span>设置的最大砍价金额 {{this.maxBargainAmount}}</span>
                </el-col>
                <el-col :span="4">
                    <span>被砍后的最低现价(售价) {{this.minCurrentPrice}}</span>
                </el-col>
                <el-col :span="4">
                    <span>最小利润 {{this.profitPrice}}</span>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
              <el-select v-model="openBargain">
                  <el-option label="关闭砍价" value="0"></el-option>
                  <el-option label="开启砍价(开启后才可修改现价与成本价)" value="1"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="商品现价(用户购买价)" v-show="openBargain==1">
          <el-input-number v-model="currentPrice" :min="0" :max="99999999"></el-input-number>
        </el-form-item>
         <el-form-item label="商品成本价(商户所得)" v-show="openBargain==1">
          <el-input-number v-model="costPrice" :min="0" :max="99999999"></el-input-number>
        </el-form-item>
        <el-form-item label="商品原价(界面灰色价格)" v-show="openBargain==1">
          <el-input-number v-model="originPrice" :min="0" :max="99999999"></el-input-number>
        </el-form-item>
        <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :label="'第' + (index + 1) + '位'"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="{
            required: true, message: '砍价金额不能为空', trigger: 'blur'}"
            v-show="openBargain==1"
        >
            <el-input v-model="domain.value" type="number" style="width: 50%" placeholder="输入该位的砍价金额,单位元,若有小数则保留到两位(分)"></el-input>
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('dynamicValidateForm')">确认修改</el-button>
            <el-button @click="addDomain">新增砍价者</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>

let closeBargainContant = "0"
let openBargainContant = "1"
export default {
  data() {
      return {
        businessCommodityId: '',
        businessCommodityName: '',
        dynamicValidateForm: {
          domains: [{
            value: 0, 
            key: Date.now()
          }]
        },
        openBargain: closeBargainContant,
        costPrice: 0,
        originPrice: 0,
        currentPrice: 0
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let bargainAllocationArr = []
            let checkFlag = false
            if (this.dynamicValidateForm.domains.length == 0 && this.openBargain == openBargainContant) {
              this.$message.error('至少设置一位砍价者,否则请关闭砍价');
              checkFlag = true
            }
            this.dynamicValidateForm.domains.forEach((item, index)=>{
                if (item.value <= 0) {
                  this.$message.error('砍价金额不能为0及负数');
                  checkFlag = true
                }
                bargainAllocationArr.push({
                  bargainDigits: (index + 1),
                  bargainAmount: item.value
                })
            })
            if (checkFlag) {return;}
            this.$http({
              url: this.$http.adornUrl(`/businessCommodity/updateBusinessCommodityBargainAllocation`),
              method: 'post',
              data: this.$http.adornData({
                businessCommodityId: this.businessCommodityId,
                openBargain: this.openBargain,
                costPrice: this.costPrice,
                originPrice: this.originPrice,
                currentPrice: this.currentPrice,
                bargainAllocationList: bargainAllocationArr
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                // this.$bus.$emit('refresh')
                this.$router.push({
                  path: "businessCommodityList",
                  query: {
                    businessId: this.$route.query.businessId,
                    businessName: this.$route.query.businessName
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            })
          } else {
            return false;
          }
        });
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
       addDomain() {
          if (this.openBargain == closeBargainContant) {
            this.$message.error('请先开启砍价');
          }
          this.dynamicValidateForm.domains.push({
            value: 0,
            key: Date.now()
          });
       },
       initData() {
          if (this.$route.query.businessCommodityId) {
            let businessId = this.$route.query.businessId;
            let businessCommodityId = this.$route.query.businessCommodityId;
            let businessCommodityName = this.$route.query.businessCommodityName
            this.$http({
              url: this.$http.adornUrl(`/businessCommodity/findBusinessCommodityBargainAllocation`),
              method: 'get',
              params: this.$http.adornParams({
                businessCommodityId: businessCommodityId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.openBargain = String(data.result.openBargain)
                this.costPrice = data.result.costPrice
                this.originPrice = data.result.originPrice
                this.currentPrice = data.result.currentPrice
                this.dynamicValidateForm.domains = []
                let bargainAllocationList = data.result.bargainAllocationList
                if (bargainAllocationList.length > 0) {
                  bargainAllocationList.forEach((item, index)=>{
                    this.dynamicValidateForm.domains.push({
                      value: item.bargainAmount,
                      key: index
                    })
                  })
                }
              } else {
                this.$message.error(data.msg);
              }
            })
          }
        },
        checkBusinessCommodityId() {
          if (this.$route.query.businessCommodityId) {
            this.businessCommodityId = this.$route.query.businessCommodityId;
            this.businessCommodityName =  this.$route.query.businessCommodityName
          } else {
            this.businessCommodityId = Math.ceil(Math.random() * 10);
            this.$alert("修改商品砍价设置需要选择一个商家,先去选择商家", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push("/businessList");
              }
            });
          }
        }
    },
    computed: {
        maxBargainNumber(){
            return this.dynamicValidateForm.domains.length
        },
        maxBargainAmount() {
            let total = Number(0);
            this.dynamicValidateForm.domains.forEach((item, index)=>{
                total += Number(item.value)
            })
            return total
        },
        minCurrentPrice() {
          return this.currentPrice - this.maxBargainAmount
        },
        profitPrice() {
          return this.currentPrice - this.maxBargainAmount - this.costPrice
        }
    },
    created() {
      this.checkBusinessCommodityId();
      this.initData();
    }
};
</script>

<style lang="less">

</style>
