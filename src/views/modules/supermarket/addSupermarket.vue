<template>
  <div class="fillcontain">
    <el-card class="box-card" v-show="!openMap">
      <div class="text item">
        <div class="box">
          <el-row style="margin-top: 20px;" >
            <el-col :span="15" :offset="2">
              <el-form :model="supermarket" :rules="rules" ref="supermarket" label-width="150px">
                <el-form-item label="超市名称" prop="bname">
                  <el-input v-model="supermarket.bname"></el-input>
                </el-form-item>
                <el-form-item label="超市标题" prop="btitle">
                  <el-input v-model="supermarket.btitle"></el-input>
                </el-form-item>
                <el-form-item label="超市描述" prop="bdescription">
                  <el-input type="textarea" autosize v-model="supermarket.bdescription"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input v-model.number="supermarket.contactPhone"></el-input>
                </el-form-item>
                <el-form-item label="推荐权重值">
                  <el-select v-model="supermarket.priority" placeholder="推荐权重值">
                    <el-option v-for="item in businessPriorityOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="满减金额">
                  <el-tag v-for="tag in supermarketEnough" :key="tag.id" style="margin-right: 20px;"
                          closable :disable-transitions="false" @close="handleClose(tag)">
                    满{{tag.buyEnoughAmount}}减{{tag.reductionAmount}}
                  </el-tag>
                  <el-button size="small" @click="addSupermarketEnough()">添加满减</el-button>
                </el-form-item>
                <el-form-item label="选择地理位置" prop>
                  <el-row>
                    <el-col :span="12">
                      <el-button @click="switchOpenMap" type="primary">修改地理位置</el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <span>经度: {{this.supermarket.lng}}</span>
                    </el-col>
                    <el-col :span="12">
                      <span>纬度: {{this.supermarket.lat}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <span>城市编码: {{this.supermarket.cityCode}}</span>
                    </el-col>
                    <el-col :span="12">
                      <span>区域编码: {{this.supermarket.adCode}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <span>预估位置: {{this.gaodeLocation.formattedAddress}}</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="大体地址(区域)" prop="addressProbably">
                  <el-autocomplete
                    v-model="supermarket.addressProbably"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="输入大体地址,如xx区xx路"
                    style="width: 100%;"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="具体地址(门牌号)" prop="addressSpecific">
                  <el-input v-model="supermarket.addressSpecific" placeholder="输入具体地址,如xx路xx层xx号"></el-input>
                </el-form-item>
                <el-form-item label="每周营业时间(多选)" prop="weekTimes">
                  <el-checkbox-group
                    v-model="supermarket.weekOperateTimeJson"
                    @change="handleCheckedWeekTimesChange"
                  >
                    <el-checkbox
                      v-for="week in weeks"
                      :label="week.value"
                      :key="week.value"
                    >{{week.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="日营业时段" prop="weekTimes">
                  <el-button @click="addDayOperateTimeItem()">新增日营业时段</el-button>
                </el-form-item>
                <el-form-item
                  v-for="(dayOperateTimeItem, index) in supermarket.dayOperateTimeJson"
                  :label="'日营业时段' + (index+1)"
                  :key="index"
                >
                  <el-time-select
                    placeholder="起始时间"
                    v-model="dayOperateTimeItem.startTime"
                    :picker-options="{
							start: '00:00',
							step: '00:30',
							end: '24:00'
							}"
                  ></el-time-select>到
                  <el-time-select
                    placeholder="结束时间"
                    v-model="dayOperateTimeItem.endTime"
                    :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '24:00'
              }"
                  ></el-time-select>
                  <el-button @click.prevent="removeDayOperateTimeItem(dayOperateTimeItem)">删除</el-button>
                </el-form-item>
                <el-form-item label="人均消费">
                  <el-input-number v-model="supermarket.averagePrice" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="总销量">
                  <el-input-number v-model="supermarket.salesTotalCount" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="月销量">
                  <el-input-number v-model="supermarket.salesCurrentMonthCount" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="最大配送距离(单位: km)">
                  <el-input-number v-model="supermarket.deliveryDistance" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="起送费(最低消费)">
                  <el-input-number v-model="supermarket.deliveryStartMinAmount" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="配送费">
                  <el-input-number v-model="supermarket.deliveryFee" :min="0" :max="99999999"></el-input-number>
                </el-form-item>

                <el-form-item label="超市头像" prop="bavatar">
                  <el-upload
                    class="avatar-uploader"
                    action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
                    :before-upload="beforeAvatarUpload"
                    :show-file-list="false">
                    <img v-if="supermarket.bavatar" :src="supermarket.bavatar" class="businessAvatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="超市详情图片">
                  <el-upload
                    class="avatar-uploader"
                    action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
                    :before-upload="beforeDetailImageUpload"
                    :show-file-list="false">
                    <img v-if="supermarket.detailContentImages" :src="supermarket.detailContentImages" class="businessAvatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="营业执照图片">
                  <el-upload
                    class="avatar-uploader"
                    action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
                    :before-upload="beforeoperateImageUpload"
                    :show-file-list="false">
                    <img v-if="operateLicense" :src="operateLicense" class="businessAvatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="卫生许可图片">
                  <el-upload
                    class="avatar-uploader"
                    action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
                    :before-upload="beforehealthImageUpload"
                    :show-file-list="false">
                    <img v-if="healthLicense" :src="healthLicense" class="businessAvatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" style="width:120px;" @click="submitForm()">保存</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-dialog class="code-dialog" width="50%" title="添加满减" :visible.sync="dialogAddFormVisible2" @close="closeDialog">
        <el-table
          :data="addEnoughForm"
          tooltip-effect="dark" :height="$GlobalApi.getWinHeight() - 300"
          @select="selectChange2"
          @select-all="selectAll2"
          ref="multipleTable2">
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column label="目标的金额" prop="buyEnoughAmount"></el-table-column>
          <el-table-column label="减少的金额" prop="reductionAmount"></el-table-column>
        </el-table>
        <pager :current-page="currentPage" :page-size="pageSize" :total="addEnoughTotal"
               @current-change="handleAddCurrentChange2" @handle-size-change="handleAddSizeChange2" background/>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" plain @click="dialogAddFormVisible2=false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleAddSupermarketBuyEnoughReduction()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
    <div class="map_wrap" v-if="openMap">
      <choose-address
        @confirmAddress="confirmAddressHandle"
        @giveUpChoose="giveUpChooseHandle"
        :lng="supermarket.lng"
        :lat="supermarket.lat"
        :initPosition="false"/>
    </div>
  </div>
</template>

<script>
  import { postByFormDataApi } from "@/utils/api";
  const weekOptions = [
    {
      name: "周一",
      value: 1
    },
    {
      name: "周二",
      value: 2
    },
    {
      name: "周三",
      value: 3
    },
    {
      name: "周四",
      value: 4
    },
    {
      name: "周五",
      value: 5
    },
    {
      name: "周六",
      value: 6
    },
    {
      name: "周日",
      value: 7
    }
  ];

  export default {
    data() {
      return {
        checkAll: false,
        supermarketId: "",
        weeks: weekOptions,
        operateLicense: "",
        operateLicenseFile: "",
        healthLicense: "",
        detailImage: "",
        healthLicenseFile: "",
        bavatarFile:'',
        detailFile:'',
        supermarket: {
          id: null,
          bname: "",
          bavatar: "",
          detailContentImages: "",
          bdescription: "",
          btitle: "",
          contactPhone: "",
          detailContentUrl: "",
          businessCategoryId: "",
          businessRootCategoryName: "",
          priority: 5,
          businessCategoryIdArray: [],
          averagePrice: "",
          salesTotalCount: "",
          salesCurrentMonthCount: "",
          addressProbably: "",
          addressSpecific: "",
          lng: "",
          lat: "",
          adCode: "",
          cityCode: "",
          startTime: "",
          endTime: "",
          dayOperateTimeJson: [],
          weekOperateTimeJson: [],
          identificationCode: "",
          deliveryFee: 5,
          deliveryDistance: 5,
          deliveryStartMinAmount: 5,
          businessAvatarFile: "",
          detailFileArray: "",
          operateLicenseFile: null,
          healthLicenseFile: null,
        },
        rules: {
          bname: [
            { required: true, message: "请输入超市名称", trigger: "blur" }
          ],
          addressProbably: [
            { required: true, message: "请输入详细地址", trigger: "blur" }
          ],
          bavatar: [
            { required: true, message: "请选择超市头像", trigger: "blur" }
          ],
          detailContentImages: [
            { required: true, message: "请选择详情图片", trigger: "blur" }
          ]
        },
        gaodeLocation: {
          formattedAddress: "",
          lnglatResult: null
        },
        openMap: false,
        businessLoading: false,
        businessPriorityOptions: [
          {
            value: 1,
            label: "一级"
          },
          {
            value: 2,
            label: "二级"
          },
          {
            value: 3,
            label: "三级"
          },
          {
            value: 4,
            label: "四级"
          },
          {
            value: 5,
            label: "五级(默认)"
          },
          {
            value: 6,
            label: "六级"
          },
          {
            value: 7,
            label: "七级"
          },
          {
            value: 8,
            label: "八级"
          },
          {
            value: 9,
            label: "九级"
          },
          {
            value: 10,
            label: "十级"
          }
        ],
        //满减
        supermarketEnough:[],
        selectDataArrL2:[],// 跨页多选所以的项，
        addEnoughTotal: 0,
        currentPage: 1,
        pageSize: 10,
        dialogAddFormVisible2: false,
        addEnoughForm: [],
      };
    },
    activated() {

    },
    methods: {
      beforeAvatarUpload(file) {
        this.bavatarFile = file;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
          return false;
        }
        const freader = new FileReader();
        freader.readAsDataURL(file);
        const self = this;
        freader.onload = function(e) {
          self.supermarket.bavatar = e.target.result;
        };
        return isLt2M;
      },
      beforeDetailImageUpload(file) {
        this.detailFile = file;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
          return false;
        }
        const freader = new FileReader();
        freader.readAsDataURL(file);
        const self = this;
        freader.onload = function(e) {
          self.supermarket.detailContentImages = e.target.result;
        };
        return isLt2M;
      },
      beforeoperateImageUpload(file) {
        this.operateLicenseFile = file;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
          return false;
        }
        const freader = new FileReader();
        freader.readAsDataURL(file);
        const self = this;
        freader.onload = function(e) {
          self.operateLicense = e.target.result;
        };
        return isLt2M;
      },
      beforehealthImageUpload(file) {
        this.healthLicenseFile = file;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
          return false;
        }
        const freader = new FileReader();
        freader.readAsDataURL(file);
        const self = this;
        freader.onload = function(e) {
          self.healthLicense = e.target.result;
        };
        return isLt2M;
      },
      switchOpenMap() {
        this.openMap = !this.openMap;
      },
      handleClose(row) {
        let item = row
        for(var i = 0; i < this.supermarketEnough.length; i++){
          if(this.supermarketEnough[i].id == item.id){
            this.supermarketEnough.splice(i,1);
          }
        }
      },
      addSupermarketEnough(){
        this.selectDataArrL2 = []
        this.dialogAddFormVisible2 = true
        this.initSupermarketBuyEnoughReductionList()
      },
      initSupermarketBuyEnoughReductionList(){
        this.$http({
          url: this.$http.adornUrl(`/supermarketBuyEnoughReduction/page`),
          method: 'get',
          params: this.$http.adornParams({
            page: this.currentPage,
            size: this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.addEnoughForm = data.page.list
            this.addEnoughTotal = data.page.totalCount;

            //请求到的数据多选后回显被选中
            this.$nextTick(function () {
              this.selectDataArrL2.forEach((item) => {
                this.addEnoughForm.forEach((listitem) => {
                  if (item.id == listitem.id) {
                    this.$refs.multipleTable2.toggleRowSelection(listitem, true);
                  }
                });
              });
            });
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      //多选
      selectChange2(arr, row) {
        let isHaveItem = this.selectDataArrL2.find((item) => item.id == row.id);
        if (isHaveItem) {
          this.selectDataArrL2 = this.selectDataArrL2.filter(
            (item) => item.id != isHaveItem.id
          );
        } else {
          this.selectDataArrL2.push(row);
        }
      },
      // 全选
      selectAll2(arr) {
        if (arr.length > 0) {
          this.addRows2(arr)
        } else {
          this.removeRows2(this.addEnoughForm)
        }
      },
      // 添加选中行
      addRows2(rows) {
        for (let key of rows) {
          // 如果选中的数据中没有这条就添加进去
          if (
            !this.selectDataArrL2.find(
              (item) => item.id === key.id
            )
          ) {
            this.selectDataArrL2.push(key);
          }
        }
      },
      // 取消选中行
      removeRows2(rows) {
        if (this.selectDataArrL2.length > 0) {
          for (let row of rows) {
            this.selectDataArrL2 = this.selectDataArrL2.filter(
              (item) => item.id !== row.id
            );
          }
        }
      },
      handleAddSupermarketBuyEnoughReduction() {
        let selectDataArrLAdd = this.selectDataArrL2
        let multipleSelectionLength = selectDataArrLAdd.length
        if (multipleSelectionLength<=0) {
          this.$message.error('请选择需绑定的满减折扣券');
        }
        //移除重复数据
        selectDataArrLAdd.forEach(item => {
          for(var i = 0; i < this.supermarketEnough.length; i++){
            if(item.id == this.supermarketEnough[i].id){
              this.supermarketEnough.splice(i,1);
            }
          }
        })
        //添加数据
        selectDataArrLAdd.forEach(item => {
          this.supermarketEnough.push({
            id: item.id,
            buyEnoughAmount: item.buyEnoughAmount,
            reductionAmount: item.reductionAmount,
          })
        })
        this.dialogAddFormVisible2 = false
      },
      handleAddCurrentChange2(val) {
        this.currentPage = val
        this.initSupermarketBuyEnoughReductionList()
      },
      handleAddSizeChange2(val) {
        this.pageSize = val
        this.initSupermarketBuyEnoughReductionList()
      },
      closeDialog() {
        this.selectDataArrL2 = []
        this.dialogAddFormVisible2 = false
      },
      confirmAddressHandle(lng, lat, formattedAddress, lnglatResult) {
        this.supermarket.lng = lng;
        this.supermarket.lat = lat;
        this.supermarket.adCode = lnglatResult.regeocode.addressComponent.adcode;
        this.supermarket.cityCode = lnglatResult.regeocode.addressComponent.citycode;
        this.gaodeLocation.formattedAddress = formattedAddress;
        this.gaodeLocation.lnglatResult = lnglatResult;
        this.supermarket.addressProbably = formattedAddress;
        this.switchOpenMap();
      },
      giveUpChooseHandle() {
        this.switchOpenMap();
      },
      querySearchAsync(queryString) {},
      handleCheckedWeekTimesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.weeks.length;
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.weeks.length;
      },
      addDayOperateTimeItem() {
        this.supermarket.dayOperateTimeJson.push({
          startTime: '00:00',
          endTime: '24:00'
        });
      },
      removeDayOperateTimeItem(item) {
        if (this.supermarket.dayOperateTimeJson.length <= 1) {
          this.$message({
            type: "err",
            message: "日营业时段至少存在一组"
          });
          return
        }
        var index = this.supermarket.dayOperateTimeJson.indexOf(item)
        if (index !== -1) {
          this.supermarket.dayOperateTimeJson.splice(index, 1)
        }
      },
      submitForm() {
        this.$refs['supermarket'].validate(valid => {
          if (valid) {
            let dayOperateTimeJson = this.supermarket.dayOperateTimeJson
            let dayOperateTimeArr = []
            dayOperateTimeJson.forEach(item => {
              dayOperateTimeArr.push(item.startTime + '-' + item.endTime)
            })
            let supermarketBuyEnoughReductionId = []
            this.supermarketEnough.forEach(item => {
              supermarketBuyEnoughReductionId.push(item.id)
            })
            //图片上传
            let submitFormData = new FormData();
            if (this.operateLicenseFile){
              submitFormData.append(
                "operateLicenseFile",this.operateLicenseFile
              );
            }
            submitFormData.append(
              "supermarketBuyEnoughReductionId",supermarketBuyEnoughReductionId
            );
            // submitFormData.append(
            //   "operateLicense",this.operateLicense
            // );
            // submitFormData.append(
            //   "healthLicense",this.healthLicense
            // );
            if (this.healthLicenseFile){
              submitFormData.append(
                "healthLicenseFile",this.healthLicenseFile
              );
            }
            if (this.bavatarFile){
              submitFormData.append(
                "bavatarFile",this.bavatarFile
              );
            }
            // submitFormData.append(
            //   "detailContentImages",this.detailImage
            // );
            if (this.detailFile){
              submitFormData.append(
                "detailContentImagesFile",this.detailFile
              );
            }
            submitFormData.append(
              "id",this.supermarket.id
            );

            submitFormData.append(
              "deliveryDistance",this.supermarket.deliveryDistance
            );
            submitFormData.append(
              "averagePrice",this.supermarket.averagePrice
            );
            submitFormData.append(
              "dayOperateTimeJson",dayOperateTimeArr
            );
            submitFormData.append(
              "weekOperateTimeJson",this.supermarket.weekOperateTimeJson
            );
            submitFormData.append(
              "bname",this.supermarket.bname
            );
            submitFormData.append(
              "bdescription",this.supermarket.bdescription
            );
            submitFormData.append(
              "btitle",this.supermarket.btitle
            );
            submitFormData.append(
              "contactPhone",this.supermarket.contactPhone
            );
            submitFormData.append(
              "priority",this.supermarket.priority
            );
            submitFormData.append(
              "lng",this.supermarket.lng
            );
            submitFormData.append(
              "lat",this.supermarket.lat
            );
            submitFormData.append(
              "adCode",this.supermarket.adCode
            );
            submitFormData.append(
              "cityCode",this.supermarket.cityCode
            );
            submitFormData.append(
              "deliveryFee",this.supermarket.deliveryFee
            );
            submitFormData.append(
              "deliveryStartMinAmount",this.supermarket.deliveryStartMinAmount
            );
            submitFormData.append(
              "addressSpecific",this.supermarket.addressSpecific
            );
            submitFormData.append(
              "addressProbably",this.supermarket.addressProbably
            );
            submitFormData.append(
              "salesCurrentMonthCount",this.supermarket.salesCurrentMonthCount
            );
            submitFormData.append(
              "salesTotalCount",this.supermarket.salesTotalCount
            );
            postByFormDataApi('/supermarket/add', submitFormData).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.go(-1)
                this.supermarket.bavatar = ''
                this.supermarket.detailContentImages = ''
              } else {
                this.$message.error(res.data.msg);
              }
            })
          } else {
            return false;
          }
        });
      }
    }
  };
</script>

<style scope>
  .map_wrap {
    width: 100%;
    height: 800px;
  }
  .businessAvatar{
    width: 400px;
  }
  .avatar-uploader{
    width: 400px;
  }
</style>
