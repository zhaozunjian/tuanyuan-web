<template>
  <div class="mod-user">
    <el-card body-style="padding:10px" class="box-card" shadow="never">
      <div slot="header">
        <el-input class="sd-input-150" clearable placeholder="请输入订单id或订单号码" size="small" @change="getchangeInit" v-model.trim="searchContent"/>
        <el-button @click="getOrdersList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询
        </el-button>
      </div>
      <el-tabs v-model="findType" type="card" @tab-click="switchTab">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane label="待付款" name="10"></el-tab-pane>
        <el-tab-pane label="待使用" name="20"></el-tab-pane>
        <el-tab-pane label="消费完成" name="30"></el-tab-pane>
        <el-tab-pane label="已退款" name="40"></el-tab-pane>
        <el-tab-pane label="已取消" name="50"></el-tab-pane>
        <el-tab-pane label="已失效" name="61"></el-tab-pane>
      </el-tabs>
      <el-table
        :cell-style="$GlobalApi.cellClass"
        :data="ordersList"
        :header-cell-style="$GlobalApi.rowClass"
        :height="$GlobalApi.getWinHeight() - 320"
        border
        highlight-current-row
        size="small"
        stripe
        style="width: 100%;">
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="订单名称"
          prop="ordersName">
        </el-table-column>
        <el-table-column
          label="订单所属商家的名称"
          prop="merchantName">
        </el-table-column>
        <el-table-column
          label="订单所属用户的昵称"
          prop="ordersUsersNickName">
        </el-table-column>
        <el-table-column
          label="订单所属用户的手机号码"
          prop="ordersUsersPhoneNumber">
        </el-table-column>
        <el-table-column
          label="订单状态"
          prop="ordersStatusDescription"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row.merchantType,scope.row.ordersId)" size="small" type="text">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sd-rightpage">
        <pager :current-page="currentPage" :page-size="pageSize" :total="total"
               @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
      </div>
    </el-card>
    <el-dialog
      title="吃喝玩乐商家订单详情"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div>
        <div class="businessRecord">
          <div><span>商户名称:</span><span>{{businessRecord.businessName}}</span></div>
          <div><span>购买商品名称:</span><span>{{businessRecord.businessCommodityName}}</span></div>
          <div><span>订单号:</span><span>{{businessRecord.ordersNumber}}</span></div>
          <div><span>订单状态:</span><span>{{businessRecord.ordersDetailStatusDescription}}</span></div>
          <div>
            <span>订单创建时间:</span><span>{{businessRecord.createTime |getTime(businessRecord.createTime)}}</span>
          </div>
          <div><span>订单完成时间:</span><span>{{businessRecord.deliveryTime |getTime(businessRecord.deliveryTime)}}</span>
          </div>
          <div><span>商户此订单所得金额:</span><span>{{businessRecord.merchantObtainAmount}}元</span></div>
          <div><span>商户类型:</span>
            <span v-if="businessRecord.merchantType===1">美食酒店商家</span>
            <span v-else-if="businessRecord.merchantType===2">超市</span>
            <span v-else>直营店</span>
          </div>
          <div><span>支付方式:</span><span>{{businessRecord.payMeans===1?'在线支付':'积分支付'}}</span></div>
          <div><span>用户昵称:</span><span>{{businessRecord.payUsersNickName}}</span></div>
          <div>
            <span>备注:</span>
            <span v-if="businessRecord.remark">{{businessRecord.remark}}</span>
            <span v-else>暂无备注</span>
          </div>
          <div><span>实际付款金额:</span><span>{{businessRecord.paymentAmount}}</span></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog
      title="超市订单详情"
      :visible.sync="dialogVisible3"
      width="30%"
    >
      <div>
        <div class="businessRecord">
          <div><span>商户名称:</span><span>{{supermarketRecord.businessName}}</span></div>
          <div><span>购买商品名称:</span><span>{{supermarketRecord.businessCommodityName}}</span></div>
          <div><span>购买商品数量:</span><span>{{supermarketRecord.payQuantity}}</span></div>
          <div><span>订单号:</span><span>{{supermarketRecord.ordersNumber}}</span></div>
          <div><span>订单状态:</span><span>{{supermarketRecord.ordersDetailStatusDescription}}</span></div>
          <div>
            <span>订单创建时间:</span><span>{{supermarketRecord.createTime |getTime(supermarketRecord.createTime)}}</span>
          </div>
          <div><span>订单完成时间:</span><span>{{supermarketRecord.deliveryTime |getTime(supermarketRecord.deliveryTime)}}</span>
          </div>
          <div><span>商户此订单所得金额:</span><span>{{supermarketRecord.merchantObtainAmount}}元</span></div>
          <div><span>商户类型:</span>
            <span v-if="supermarketRecord.merchantType===1">美食酒店商家</span>
            <span v-else-if="supermarketRecord.merchantType===2">超市</span>
            <span v-else>直营店</span>
          </div>
          <div><span>支付方式:</span><span>{{supermarketRecord.payMeans===1?'在线支付':'积分支付'}}</span></div>
          <div><span>用户昵称:</span><span>{{supermarketRecord.payUsersNickName}}</span></div>
          <div>
            <span>备注:</span>
            <span v-if="businessRecord.remark">{{supermarketRecord.remark}}</span>
            <span v-else>暂无备注</span>
          </div>
          <div><span>实际付款金额:</span><span>{{supermarketRecord.paymentAmount}}</span></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible3 = false">确 定</el-button>
            </span>
    </el-dialog>
    <!--            直营店订单详情-->
    <el-dialog
      title="生鲜订单详情"
      :visible.sync="dialogVisible2"
      width="30%"
    >
      <div>
        <div class="h30"><span>商户名称:</span><span>{{directsRecord.directsName}}</span></div>
        <div class="h30"><span>订单号:</span><span>{{directsRecord.ordersNumber}}</span></div>
        <div class="h30"><span>订单状态:</span><span>{{directsRecord.ordersDetailStatusDescription}}</span></div>
        <div class="h30"><span>订单创建时间:</span><span>{{directsRecord.createTime |getTime(directsRecord.createTime)}}</span>
        </div>
        <div class="h30"><span>订单完成时间:</span><span>{{directsRecord.deliveryTime |getTime(directsRecord.deliveryTime)}}</span>
        </div>
        <div class="h30"><span>商户此订单所得金额:</span><span>{{directsRecord.merchantObtainAmount}}元</span></div>
        <div class="h30"><span>商户类型:</span>
          <span v-if="directsRecord.merchantType===1">美食酒店商家</span>
          <span v-else-if="directsRecord.merchantType===1">超市</span>
          <span v-else>直营店</span>
        </div>
        <div style="padding: 20px 0">
          <h4 class="mb10">商品列表</h4>
          <div v-for="(item,index) in directsRecord.ordersDirectsCommodityList" :key="index"
               class="flex align-center mb10">
            <img :src="item.directsCommodityAvatar | getImg(item.directsCommodityAvatar)" alt=""
                 style="width: 30px;height: 30px;margin-right: 10px;">
            <span class="mr20">{{item.directsCommodityName}}</span>
            <span class="mr20">x{{item.payQuantity }}</span>
            <span>￥{{item.currentPrice }}</span>
          </div>
        </div>
        <div class="h30"><span>支付方式:</span><span>{{directsRecord.payMeans===1?'在线支付':'积分支付'}}</span></div>
        <div class="h30"><span>用户昵称:</span><span>{{directsRecord.payUsersNickName}}</span></div>
        <div class="h30"><span>收货大体地址:</span><span>{{directsRecord.deliveryAddress}}</span></div>
        <div class="h30"><span>收货地址门牌号:</span><span>{{directsRecord.houseNumber }}</span></div>
        <div class="h30">
          <span>付款途径:</span>
          <span v-if="directsRecord.payWay==1">支付宝</span>
          <span v-else-if="directsRecord.payWay==2">微信</span>
          <span v-else>银行卡</span>
        </div>
        <div>
          <span>备注:</span>
          <span v-if="businessRecord.remark">{{directsRecord.remark}}</span>
          <span v-else>暂无备注</span>
        </div>
        <div class="h30"><span>实际付款金额:</span><span>{{directsRecord.paymentAmount}}</span></div>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>

const merchantTypeBusiness = 1
const merchantTypeDirects = 3
const merchantTypeSupermarket = 2

export default {
    data() {
        return {
            findType: 0,
            searchContent: '',
          currentPage: this.$GlobalApi.Constants.DICT.PAGE,
          pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
          total: this.$GlobalApi.Constants.DICT.TOTAL,
          ordersList: [],
            dialogVisible: false,
            dialogVisible2: false,
          dialogVisible3: false,
            businessRecord: {},
            directsRecord: {},
            supermarketRecord: {}
        }
    },
    mounted() {
        this.getOrdersList()
    },
    methods: {
        switchTab() {
            this.currentPage = 1
            this.pageSize = 10
            this.getOrdersList()
        },
      getchangeInit(val){
        if (val === null || val === ''){
          this.getOrdersList();
        }
      },
        getOrdersList() {
          this.$http({
            url: this.$http.adornUrl('/ordersRecord/pageWithSearch'),
            method: 'post',
            params: this.$http.adornParams({
              findType: this.findType,
              searchContent: this.searchContent,
              currentPage: this.currentPage,
              pageSize: this.pageSize
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.ordersList = data.result.data
              this.total = data.result.pageModel.total
            } else {
              this.$message.error(data.msg);
            }
          })
        },
        handleEdit(merchantType, ordersId) {
            if (merchantTypeBusiness === merchantType) {
              this.dialogVisible = true
              this.$http({
                url: this.$http.adornUrl(`/orders/businessRecord/detailByOrdersId`),
                method: 'get',
                params: this.$http.adornParams({
                  ordersId: ordersId
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.businessRecord = data.result
                } else {
                  this.$message.error(data.msg);
                }
              })
            } else if(merchantTypeDirects === merchantType) {
                this.dialogVisible2 = true
              this.$http({
                url: this.$http.adornUrl(`/orders/directsRecord/detailByOrdersId`),
                method: 'get',
                params: this.$http.adornParams({
                  ordersId: ordersId
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.directsRecord = data.result
                } else {
                  this.$message.error(data.msg);
                }
              })
            } else if (merchantTypeSupermarket === merchantType) {
              this.dialogVisible3 = true
              this.$http({
                url: this.$http.adornUrl(`/orders/supermaketRecord/detailByOrdersId`),
                method: 'get',
                params: this.$http.adornParams({
                  ordersId: ordersId
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.supermarketRecord = data.result
                } else {
                  this.$message.error(data.msg);
                }
              })
            }
        },
        // 切换分页
        handleCurrentChange(val) {
          this.currentPage = val
            this.getOrdersList()
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getOrdersList()
        }
}
};
</script>

<style scoped>

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.h30 {
    height: 30px;
    line-height: 30px;
}
</style>
