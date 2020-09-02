<template>
  <el-card body-style="padding:10px;height:100%;" shadow="never">
    <div slot="header" >
      <el-cascader
        v-model="busine" class="sd-width-150" size="small" :options="busineArray" @change="busineChange" :props="{ expandTrigger: 'hover' }"></el-cascader>
      <el-button type="primary" size="small" icon="el-icon-search" class="sd-mag-l-10" @click="getlist()" >查询</el-button>
    </div>
    <div v-show="userFlag">
      <el-table
        v-loading="vLoading"
        :height="$GlobalApi.getWinHeight() - 268"
        size="small"
        :data="modifylogtableData"
        stripe
        highlight-current-row
        :header-cell-style="$GlobalApi.rowClass"
        border
        :cell-style="$GlobalApi.cellClassNoEdit">
        <el-table-column prop="id" label="ID" width="150px" show-overflow-tooltip />
        <el-table-column prop="userName" label="操作者" width="120px"/>
        <el-table-column prop="operateTime" label="操作时间" width="140px"/>
        <el-table-column prop="operateIp" label="操作IP" width="120px"/>
        <el-table-column prop="nickName" label="用户提现名称" width="120px"/>
        <el-table-column label="提现金额" >
          <el-table-column
            prop="withdrawAmount"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.withdrawAmount == scope.row.newWithdrawAmount ? '':'logClass'">{{scope.row.withdrawAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newWithdrawAmount"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.withdrawAmount == scope.row.newWithdrawAmount ? '':'logClass'">{{scope.row.newWithdrawAmount}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="提现状态" >
          <el-table-column
            prop="withdrawStatus"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.noShareAloneOneLevelReward == scope.row.withdrawStatus ? '':'logClass'">{{scope.row.withdrawStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newWithdrawStatus"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.newWithdrawStatus == scope.row.withdrawStatus ? '':'logClass'">{{scope.row.newWithdrawStatus}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="申请状态" >
          <el-table-column
            prop="applyStatus"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.applyStatus == scope.row.newApplyStatus ? '':'logClass'">{{scope.row.applyStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newApplyStatus"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.newApplyStatus == scope.row.applyStatus ? '':'logClass'">{{scope.row.newApplyStatus}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="结果状态" >
          <el-table-column
            prop="resultStatus"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.resultStatus == scope.row.newNoShareMultipleTwoLevelReward ? '':'logClass'">{{scope.row.resultStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newResultStatus"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.newResultStatus == scope.row.resultStatus ? '':'logClass'">{{scope.row.newResultStatus}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="提现途径" >
          <el-table-column
            prop="withdrawWay"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.withdrawWay == scope.row.newWithdrawWay ? '':'logClass'">{{scope.row.withdrawWay}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newWithdrawWay"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.newWithdrawWay == scope.row.withdrawWay ? '':'logClass'">{{scope.row.newWithdrawWay}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="银行卡号" >
          <el-table-column
            prop="cardNumber"
            label="原记录" width="160">
            <template slot-scope="scope">
              <span :class="scope.row.cardNumber == scope.row.newCardNumber ? '':'logClass'">{{scope.row.cardNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newCardNumber"
            label="新记录" width="160">
            <template slot-scope="scope">
              <span :class="scope.row.newCardNumber == scope.row.cardNumber ? '':'logClass'">{{scope.row.newCardNumber}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="持卡人姓名" >
          <el-table-column
            prop="cardHolder"
            label="原记录" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.cardHolder == scope.row.newCardHolder ? '':'logClass'">{{scope.row.cardHolder}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newCardHolder"
            label="新记录" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.newCardHolder == scope.row.cardHolder ? '':'logClass'">{{scope.row.newCardHolder}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="银行名称" >
          <el-table-column
            prop="bankName"
            label="原记录" width="130">
            <template slot-scope="scope">
              <span :class="scope.row.bankName == scope.row.newBankName ? '':'logClass'">{{scope.row.bankName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newBankName"
            label="新记录" width="130">
            <template slot-scope="scope">
              <span :class="scope.row.newBankName == scope.row.bankName ? '':'logClass'">{{scope.row.newBankName}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="交易成交号" >
          <el-table-column
            prop="transactionId"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.transactionId == scope.row.newTransactionId ? '':'logClass'">{{scope.row.transactionId}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newTransactionId"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.newTransactionId == scope.row.transactionId ? '':'logClass'">{{scope.row.newTransactionId}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="支付信息" >
          <el-table-column
            prop="withdrawCallbackMessageText"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.withdrawCallbackMessageText == scope.row.newWithdrawCallbackMessageText ? '':'logClass'">{{scope.row.withdrawCallbackMessageText}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newWithdrawCallbackMessageText"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.newWithdrawCallbackMessageText == scope.row.withdrawCallbackMessageText ? '':'logClass'">{{scope.row.newWithdrawCallbackMessageText}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="merchantFlag">
      <el-table
        v-loading="vLoading"
        :height="$GlobalApi.getWinHeight() - 268"
        size="small"
        :data="modifylogtableData"
        stripe
        highlight-current-row
        :header-cell-style="$GlobalApi.rowClass"
        border
        :cell-style="$GlobalApi.cellClassNoEdit">
        <el-table-column prop="id" label="ID" width="150px" show-overflow-tooltip />
        <el-table-column prop="userName" label="操作者" width="120px"/>
        <el-table-column prop="operateTime" label="操作时间" width="140px"/>
        <el-table-column prop="operateIp" label="操作IP" width="120px"/>
        <el-table-column prop="nickName" label="商户提现名称" width="120px"/>
        <el-table-column label="提现金额" >
          <el-table-column
            prop="withdrawAmount"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.withdrawAmount == scope.row.newWithdrawAmount ? '':'logClass'">{{scope.row.withdrawAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newWithdrawAmount"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.withdrawAmount == scope.row.newWithdrawAmount ? '':'logClass'">{{scope.row.newWithdrawAmount}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="提现状态" >
          <el-table-column
            prop="withdrawStatus"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.noShareAloneOneLevelReward == scope.row.withdrawStatus ? '':'logClass'">{{scope.row.withdrawStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newWithdrawStatus"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.newWithdrawStatus == scope.row.withdrawStatus ? '':'logClass'">{{scope.row.newWithdrawStatus}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="申请状态" >
          <el-table-column
            prop="applyStatus"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.applyStatus == scope.row.newApplyStatus ? '':'logClass'">{{scope.row.applyStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newApplyStatus"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.newApplyStatus == scope.row.applyStatus ? '':'logClass'">{{scope.row.newApplyStatus}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="结果状态" >
          <el-table-column
            prop="resultStatus"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.resultStatus == scope.row.newNoShareMultipleTwoLevelReward ? '':'logClass'">{{scope.row.resultStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newResultStatus"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.newResultStatus == scope.row.resultStatus ? '':'logClass'">{{scope.row.newResultStatus}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="提现途径" >
          <el-table-column
            prop="withdrawWay"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.withdrawWay == scope.row.newWithdrawWay ? '':'logClass'">{{scope.row.withdrawWay}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newWithdrawWay"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.newWithdrawWay == scope.row.withdrawWay ? '':'logClass'">{{scope.row.newWithdrawWay}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="银行卡号" >
          <el-table-column
            prop="cardNumber"
            label="原记录" width="160">
            <template slot-scope="scope">
              <span :class="scope.row.cardNumber == scope.row.newCardNumber ? '':'logClass'">{{scope.row.cardNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newCardNumber"
            label="新记录" width="160">
            <template slot-scope="scope">
              <span :class="scope.row.newCardNumber == scope.row.cardNumber ? '':'logClass'">{{scope.row.newCardNumber}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="持卡人姓名" >
          <el-table-column
            prop="cardHolder"
            label="原记录" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.cardHolder == scope.row.newCardHolder ? '':'logClass'">{{scope.row.cardHolder}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newCardHolder"
            label="新记录" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.newCardHolder == scope.row.cardHolder ? '':'logClass'">{{scope.row.newCardHolder}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="银行名称" >
          <el-table-column
            prop="bankName"
            label="原记录" width="130">
            <template slot-scope="scope">
              <span :class="scope.row.bankName == scope.row.newBankName ? '':'logClass'">{{scope.row.bankName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newBankName"
            label="新记录" width="130">
            <template slot-scope="scope">
              <span :class="scope.row.newBankName == scope.row.bankName ? '':'logClass'">{{scope.row.newBankName}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="交易成交号" >
          <el-table-column
            prop="transactionId"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.transactionId == scope.row.newTransactionId ? '':'logClass'">{{scope.row.transactionId}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newTransactionId"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.newTransactionId == scope.row.transactionId ? '':'logClass'">{{scope.row.newTransactionId}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <!--<el-table-column label="支付信息" >-->
          <!--<el-table-column-->
            <!--prop="withdrawCallbackMessageText"-->
            <!--label="原记录" width="110">-->
            <!--<template slot-scope="scope">-->
              <!--<span :class="scope.row.withdrawCallbackMessageText == scope.row.newWithdrawCallbackMessageText ? '':'logClass'">{{scope.row.withdrawCallbackMessageText}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="newWithdrawCallbackMessageText"-->
            <!--label="新记录" width="110">-->
            <!--<template slot-scope="scope">-->
              <!--<span :class="scope.row.newWithdrawCallbackMessageText == scope.row.withdrawCallbackMessageText ? '':'logClass'">{{scope.row.newWithdrawCallbackMessageText}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
    <div v-show="busine.length == 1">
      <el-table
        v-loading="vLoading"
        :height="$GlobalApi.getWinHeight() - 268"
        size="small"
        :data="modifylogtableData"
        stripe
        highlight-current-row
        :header-cell-style="$GlobalApi.rowClass"
        border
        :cell-style="$GlobalApi.cellClassNoEdit">
        <el-table-column prop="id" label="ID" width="150px" show-overflow-tooltip />
        <el-table-column prop="userName" label="操作者"/>
        <el-table-column prop="operateTime" label="操作时间" width="140px"/>
        <el-table-column prop="operateIp" label="操作IP" width="120px"/>
        <el-table-column label="总毛利率" >
          <el-table-column
            prop="totalProfit"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.totalProfit == scope.row.newTotalProfit ? '':'logClass'">{{scope.row.totalProfit}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newTotalProfit"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.totalProfit == scope.row.newTotalProfit ? '':'logClass'">{{scope.row.newTotalProfit}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="无分享单上级一级分成率" >
          <el-table-column
            prop="noShareAloneOneLevelReward"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.noShareAloneOneLevelReward == scope.row.newNoShareAloneOneLevelReward ? '':'logClass'">{{scope.row.noShareAloneOneLevelReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newNoShareAloneOneLevelReward"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.noShareAloneOneLevelReward == scope.row.newNoShareAloneOneLevelReward ? '':'logClass'">{{scope.row.newNoShareAloneOneLevelReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="无分享多上级一级分成率" >
          <el-table-column
            prop="noShareMultipleOneLevelReward"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.noShareMultipleOneLevelReward == scope.row.newNoShareMultipleOneLevelReward ? '':'logClass'">{{scope.row.noShareMultipleOneLevelReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newNoShareMultipleOneLevelReward"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.noShareMultipleOneLevelReward == scope.row.newNoShareMultipleOneLevelReward ? '':'logClass'">{{scope.row.newNoShareMultipleOneLevelReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="无分享多上级二级分成率" >
          <el-table-column
            prop="noShareMultipleTwoLevelReward"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.noShareMultipleTwoLevelReward == scope.row.newNoShareMultipleTwoLevelReward ? '':'logClass'">{{scope.row.noShareMultipleTwoLevelReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newNoShareMultipleTwoLevelReward"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.noShareMultipleTwoLevelReward == scope.row.newNoShareMultipleTwoLevelReward ? '':'logClass'">{{scope.row.newNoShareMultipleTwoLevelReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="无分享的用户返积分率" >
          <el-table-column
            prop="noShareUserIntegralReward"
            label="原记录">
            <template slot-scope="scope">
              <span :class="scope.row.noShareUserIntegralReward == scope.row.newNoShareUserIntegralReward ? '':'logClass'">{{scope.row.noShareUserIntegralReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newNoShareUserIntegralReward"
            label="新记录">
            <template slot-scope="scope">
              <span :class="scope.row.noShareUserIntegralReward == scope.row.newNoShareUserIntegralReward ? '':'logClass'">{{scope.row.newNoShareUserIntegralReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="被动分享人的分享率" >
          <el-table-column
            prop="receiveShareShareReward"
            label="原记录" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareShareReward == scope.row.newReceiveShareShareReward ? '':'logClass'">{{scope.row.receiveShareShareReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newReceiveShareShareReward"
            label="新记录" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareShareReward == scope.row.newReceiveShareShareReward ? '':'logClass'">{{scope.row.newReceiveShareShareReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="被分享单上级一级分成类" >
          <el-table-column
            prop="receiveShareAloneOneLevelReward"
            label="原记录" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareAloneOneLevelReward == scope.row.newReceiveShareAloneOneLevelReward ? '':'logClass'">{{scope.row.receiveShareAloneOneLevelReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newReceiveShareAloneOneLevelReward"
            label="新记录" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareAloneOneLevelReward == scope.row.newReceiveShareAloneOneLevelReward ? '':'logClass'">{{scope.row.newReceiveShareAloneOneLevelReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="被分享多上级一级分成率" >
          <el-table-column
            prop="receiveShareMultipleOneLevelReward"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareMultipleOneLevelReward == scope.row.newReceiveShareMultipleOneLevelReward ? '':'logClass'">{{scope.row.receiveShareMultipleOneLevelReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newReceiveShareMultipleOneLevelReward"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareMultipleOneLevelReward == scope.row.newReceiveShareMultipleOneLevelReward ? '':'logClass'">{{scope.row.newReceiveShareMultipleOneLevelReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="被分享多上级二级分成率" >
          <el-table-column
            prop="receiveShareMultipleTwoLevelReward"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareMultipleTwoLevelReward == scope.row.newReceiveShareMultipleTwoLevelReward ? '':'logClass'">{{scope.row.receiveShareMultipleTwoLevelReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newReceiveShareMultipleTwoLevelReward"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareMultipleTwoLevelReward == scope.row.newReceiveShareMultipleTwoLevelReward ? '':'logClass'">{{scope.row.newReceiveShareMultipleTwoLevelReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="被分享人返积分率" >
          <el-table-column
            prop="receiveShareUserIntegralReward"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareUserIntegralReward == scope.row.newReceiveShareUserIntegralReward ? '':'logClass'">{{scope.row.receiveShareUserIntegralReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newReceiveShareUserIntegralReward"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.receiveShareUserIntegralReward == scope.row.newReceiveShareUserIntegralReward ? '':'logClass'">{{scope.row.newReceiveShareUserIntegralReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="主动分享人的分享率">
          <el-table-column prop="initiateShareShareReward" label="原记录" width="110" show-tooltip-when-overflow>
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareShareReward == scope.row.newInitiateShareShareReward ? '':'logClass'">{{scope.row.initiateShareShareReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newInitiateShareShareReward"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareShareReward == scope.row.newInitiateShareShareReward ? '':'logClass'">{{scope.row.newInitiateShareShareReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="主分享单上级一级分成率" >
          <el-table-column
            prop="initiateShareAloneOneLevelReward"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareAloneOneLevelReward == scope.row.newInitiateShareAloneOneLevelReward ? '':'logClass'">{{scope.row.initiateShareAloneOneLevelReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newInitiateShareAloneOneLevelReward"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareAloneOneLevelReward == scope.row.newInitiateShareAloneOneLevelReward ? '':'logClass'">{{scope.row.newInitiateShareAloneOneLevelReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="主分享多上级一级分成率" >
          <el-table-column
            prop="initiateShareMultipleOneLevelReward"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareMultipleOneLevelReward == scope.row.newInitiateShareMultipleOneLevelReward ? '':'logClass'">{{scope.row.initiateShareMultipleOneLevelReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newInitiateShareMultipleOneLevelReward"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareMultipleOneLevelReward == scope.row.newInitiateShareMultipleOneLevelReward ? '':'logClass'">{{scope.row.newInitiateShareMultipleOneLevelReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="主分享多上级二级分成率" >
          <el-table-column
            prop="initiateShareMultipleTwoLevelReward"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareMultipleTwoLevelReward == scope.row.newInitiateShareMultipleTwoLevelReward ? '':'logClass'">{{scope.row.initiateShareMultipleTwoLevelReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newInitiateShareMultipleTwoLevelReward"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareMultipleTwoLevelReward == scope.row.newInitiateShareMultipleTwoLevelReward ? '':'logClass'">{{scope.row.newInitiateShareMultipleTwoLevelReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="主分享人返积分率" >
          <el-table-column
            prop="initiateShareUserIntegralReward"
            label="原记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareUserIntegralReward == scope.row.newInitiateShareUserIntegralReward ? '':'logClass'">{{scope.row.initiateShareUserIntegralReward}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="newInitiateShareUserIntegralReward"
            label="新记录" width="110">
            <template slot-scope="scope">
              <span :class="scope.row.initiateShareUserIntegralReward == scope.row.newInitiateShareUserIntegralReward ? '':'logClass'">{{scope.row.newInitiateShareUserIntegralReward}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="sd-rightpage">
      <!-- 分页标签 -->
      <pager :current-page="currPage" @current-change="getcurrentPage" :total="totalCount"
             @handle-size-change="getpageSize" :page-size="pageSize" background/>
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        vLoading:false,
        //表格
        modifylogtableData: [],
        busineArray:[{
          value:3101,
          label:'分成配置'
        },{
          value:11,
          label:'用户提现',
          children: [{
            value:1101,
            label:'同意'
          },{
            value:1102,
            label:'拒绝'
          },{
            value:1103,
            label:'人工确认'
          }]
        },{
          value:21,
          label:'商户提现',
          children: [{
            value:2101,
            label:'同意'
          },{
            value:2102,
            label:'拒绝'
          },{
            value:2103,
            label:'已到账'
          }]
        }],
        currPage:1,
        pageSize:10,
        totalCount:0,
        busine:[3101],
        userFlag:false,
        merchantFlag:false
      }
    },
    created(){
      this.getlist();
    },
    methods: {
      busineChange(val){
        this.userFlag = false;
        this.merchantFlag = false;
        this.modifylogtableData = []
        if (val.length == 2){
          if (val[0] == 11){
            this.userFlag = true;
          }
          if (val[0] == 21){
            this.merchantFlag = true;
          }
        }
      },
      getlist () {
        let temp = 0;
        if (this.busine.length == 1){
          temp = this.busine[0]
        }else {
          temp = this.busine[1]
        }
        this.vLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/manage/log/list'),
          method: 'get',
          params: this.$http.adornParams({
            page:this.currPage,
            size:this.pageSize,
            type:temp
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.modifylogtableData = data.page.list
            this.totalCount = data.page.totalCount
          } else {
            this.$message.error(data.msg);
          }
          this.vLoading = false
        })
      },
      getcurrentPage(val) {
        this.currPage = val;
        this.getlist()
      },
      getpageSize(val) {
        this.pageSize = val;
        this.getlist()
      }
    }
  }
</script>

<style>
  .logClass{
    color: red;
  }
</style>
