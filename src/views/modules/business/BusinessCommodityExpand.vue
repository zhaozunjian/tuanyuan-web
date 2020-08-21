<template>
  <el-card class="box-card">
    <div class="text item">
      <el-button @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>
      <hr class="sd-hr"/>
      <div style="width: 70%">
        <el-form
          :model="form" ref="form" label-width="180px">
          <el-form-item label="所选择的商品名称">
            <span>{{this.businessCommodityName}}</span>
          </el-form-item>
          <el-form-item label="是否不允许退款" prop="isNoRefundAllowed">
            <el-select v-model="form.isNoRefundAllowed">
              <el-option label="关闭(允许退款)" value="0"></el-option>
              <el-option label="开启(不允许退款)" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否开启商品订单消费截止日期限制" prop="isPayAutoExpired">
            <el-select v-model="form.isPayAutoExpired">
              <el-option label="关闭" value="0"></el-option>
              <el-option label="开启(开启后才可修改限制消费的时间)" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="该商品订单消费截止日期" prop="payAutoExpiredTime" v-show="form.isPayAutoExpired==1">
            <div class="block">
              <el-date-picker
                v-model="form.payAutoExpiredTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        businessCommodityId: '',
        businessCommodityName: '',
        form: {
          isPayAutoExpired: "0",
          payAutoExpiredTime: '',
          isNoRefundAllowed: "0"
        }
      }
    },
    mounted() {
      this.checkBusinessCommodityId();
      this.initData();
    },
    methods: {
      checkBusinessCommodityId() {
        if (this.$route.query.businessCommodityId) {
          this.businessCommodityId = this.$route.query.businessCommodityId;
          this.businessCommodityName =  this.$route.query.businessCommodityName
        } else {
          this.businessCommodityId = Math.ceil(Math.random() * 10);
          this.$alert("修改设置需要选择一个商家,先去选择商家", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.go(-1)
            }
          });
        }
      },
      initData() {
        this.initExpandInfo()
      },
      initExpandInfo() {
        this.$http({
          url: this.$http.adornUrl('/businessCommodityExpand/info'),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityId: this.businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.form = data.result
            this.form.isPayAutoExpired = String(data.result.isPayAutoExpired)
            this.form.isNoRefundAllowed = String(data.result.isNoRefundAllowed)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      submitForm() {
        this.$http({
          url: this.$http.adornUrl('/businessCommodityExpand/update'),
          method: 'post',
          params: this.$http.adornParams({
            businessCommodityId: this.businessCommodityId,
            isPayAutoExpired: this.form.isPayAutoExpired,
            payAutoExpiredTime: this.form.payAutoExpiredTime,
            isNoRefundAllowed: this.form.isNoRefundAllowed
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.$router.push({
              path: "businessCommodityList",
              query: {
                businessId: this.$route.query.businessId,
                businessName: this.$route.query.businessName
              }
            });
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  };
</script>
