<template>
  <el-card>
    <div class="text item">
      <el-button @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>
      <div class="box">
        <hr class="sd-hr"/>
        <el-row style="margin-top: 20px;">
          <el-col :span="15" :offset="2">
            <div slot="header">
              <span>所选择的商品名称: {{this.businessCommodityName}}</span>
            </div>
            <el-form :model="form" ref="form" label-width="100px" class="demo-dynamic">
              <el-form-item label="是否开启限制售卖时间" prop="openContractTime">
                <el-select v-model="openContractTime">
                  <el-option label="关闭" value="0"></el-option>
                  <el-option label="开启(开启后才可修改限制售卖的时间)" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="限制售卖结束时间(截止日期)" prop="contractEndTime" v-show="openContractTime==1">
                <div class="block">
                  <el-date-picker
                    v-model="contractEndTime"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
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
        form: {},
        openContractTime: "0",
        contractEndTime: 0
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
        this.initContractTimeInfo()
      },
      initContractTimeInfo() {
        if (this.$route.query.businessCommodityId) {
          let businessCommodityId = this.$route.query.businessCommodityId;
          this.$http({
            url: this.$http.adornUrl('/businessCommodity/findContractTime'),
            method: 'get',
            params: this.$http.adornParams({
              businessCommodityId: businessCommodityId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.openContractTime = String(data.result.openContractTime)
              this.contractEndTime = data.result.contractEndTime
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      submitForm() {
        this.$http({
          url: this.$http.adornUrl('/businessCommodity/updateContractTime'),
          method: 'post',
          params: this.$http.adornParams({
            businessCommodityId: this.businessCommodityId,
            openContractTime: this.openContractTime,
            contractEndTime: this.contractEndTime
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
