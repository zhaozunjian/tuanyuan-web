<template>
  <el-card>
    <div class="text item">
      <el-button @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>
      <div class="box">
        <hr class="sd-hr"/>
        <el-row style="margin-top: 20px;">
          <el-col :span="15" :offset="2">
            <div slot="header">
              <span>所选择的商家名称: {{this.businessName}}</span>
            </div>
            <el-form :model="form" ref="form" label-width="100px" class="demo-dynamic">
              <el-form-item label="合作周期结束时间(截止日期)" prop="contractEndTime">
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
        businessId: '',
        businessName: '',
        form: {},
        contractEndTime: 0
      }
    },
    mounted() {
      this.checkBusinessId();
      this.initData();
    },
    methods: {
      checkBusinessId() {
        if (this.$route.query.businessId) {
          this.businessId = this.$route.query.businessId;
          this.businessName =  this.$route.query.businessName
        } else {
          this.businessId = Math.ceil(Math.random() * 10);
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
        if (this.$route.query.businessId) {
          let businessId = this.$route.query.businessId;
          this.$http({
            url: this.$http.adornUrl('/business/findContractTime'),
            method: 'get',
            params: this.$http.adornParams({
              businessId: businessId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.contractEndTime = data.result.contractEndTime
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      submitForm() {
        this.$confirm("确认修改该商家的合作周期结束时间吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/business/updateContractTime'),
            method: 'post',
            params: this.$http.adornParams({
              businessId: this.businessId,
              contractEndTime: this.contractEndTime
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$router.go(-1)
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
      }
    }
  };
</script>

