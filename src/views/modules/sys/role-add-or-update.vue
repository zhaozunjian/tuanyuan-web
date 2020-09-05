<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="isEdit ? '修改' : '新增'"
    :visible.sync="visible"
    @close="resDate"
    top="5vh">
    <el-form :model="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()" class="sd-form"
             label-width="80px"
             ref="dataForm"
             v-loading="depLoading">
      <el-card body-style="padding:10px" class="box-card" shadow="never">
        <span class="clearfix">
          <i class="el-icon-document"></i>
          <span>基础信息</span>
        </span>
        <hr class="sd-hr">
        <el-form-item label="岗位编号" prop="roleId" v-if="isEdit ? true : false">
          <el-input :disabled="isEdit ? true : false" clearable placeholder="岗位编号" size="small"
                    v-model="dataForm.roleId"></el-input>
        </el-form-item>
        <el-form-item label="岗位名称" prop="roleName">
          <el-input disabled placeholder="岗位名称" size="small" v-model="dataForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isuse">
          <el-switch :active-value="1" :inactive-value="0" v-model="dataForm.isuse"></el-switch>
        </el-form-item>
      </el-card>

      <el-card body-style="padding:10px" class="box-card" shadow="never">
        <span class="clearfix">
          <i class="el-icon-document"></i>
          <span>菜单权限</span>
        </span>
        <hr class="sd-hr">
        <el-form-item class="role-permission" label="菜单权限" size="mini">
          <el-button @click="checkMenuBu" size="small" type="primary">选择菜单权限</el-button>
          <el-dialog
            :append-to-body="true"
            :modal="false"
            :visible.sync="checkMenu"
            title="菜单权限"
            width="70%">
          <span>
            <vxe-table
              :data.sync="menuList"
              :loading="menuLoading"
              :max-height="$GlobalApi.getWinHeight() - 320"
              :select-config="{labelField: 'menuId',checkRowKeys:checkMenus}"
              :tree-config="{children: 'children'}"
              @select-all="getSelectRecords"
              @select-change="getSelectRecords"
              ref="menuListTrees"
              resizable
              row-id="menuId"
              style="width: 100%"
            >
          <vxe-table-column title="菜单编号" tree-node type="selection" widtt="10%"></vxe-table-column>
          <vxe-table-column field="mname" title="名称" widtt="30%"></vxe-table-column>
          <vxe-table-column field="parentName" title="上级菜单" widtt="30%"></vxe-table-column>
          <vxe-table-column field="mtype" title="类型" widtt="15%">
            <template slot-scope="scope">
              <el-tag size="small" v-if="scope.row.mtype === 0">目录</el-tag>
              <el-tag size="small" type="success" v-else-if="scope.row.mtype === 1">菜单</el-tag>
              <el-tag size="small" type="info" v-else-if="scope.row.mtype === 2">按钮</el-tag>
            </template>
          </vxe-table-column>
          <vxe-table-column field="orderNum" title="排序号" width="15%"></vxe-table-column>
        </vxe-table>
          </span>
            <span class="dialog-footer" slot="footer">
          <el-button @click="checkMenu = false">取 消</el-button>
          <el-button @click="checkMenu = false,findParents(selectionDatas)" type="primary">确 定</el-button>
          </span>
          </el-dialog>
        </el-form-item>
      </el-card>
    </el-form>
    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        menuLoading: false,
        tableEdit: {
          trigger: 'click',
          mode: 'cell',
          isTabKey: true,
          isArrowKey: true,
          isCheckedEdit: true,
          autoClearActive: true
        },
        depLoading: false,
        selDep: false,
        checkMenu: false,
        list: [],
        depMenuList: [],

        visible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'orgname',
          children: 'children'
        },
        dataForm: {
          roleId: '',
          roleName: '',
          isuse: 1
        },
        dataRule: {
          roleName: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ]
        },
        tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
        flags: 0,
        childFlags: 0,
        editDatas: [],
        checkMenus: [],
        selMenus: [],
        isEdit: false,
        // flag: 0,
        newList: [],
        MenuDatas: [],
        // maps: [],
        selectionDatas: []
      }
    },
    watch: {

    },
    created () {

    },
    mounted () {
    },
    methods: {
      resDate () {
        this.$refs['dataForm'].resetFields()
        // this.flag = 1
        this.list = []
      },
      cancels () {
        this.tableEdit = {
          trigger: 'click',
          mode: 'cell',
          isTabKey: true,
          isArrowKey: true,
          isCheckedEdit: true,
          autoClearActive: true
        }
      },
      openSelDep () {
        this.tableEdit = {
          trigger: 'click',
          mode: 'cell',
          isTabKey: true,
          isArrowKey: true,
          isCheckedEdit: true,
          autoClearActive: false
        }
        this.selDep = true
      },
      getParents (data, name) {
        for (var i in data) {
          if (data[i].mname == name) {
            return [data[i].menuId]
          }
          if (data[i].children) {
            var ro = this.getParents(data[i].children, name)
            if (ro !== undefined) {
              return ro.concat(data[i].menuId)
            }
          }
        }
      },


      findParents(selData){
        this.selMenus = []
        if (selData.length >= 1) {
          for (let i = 0; i < selData.length; i++) {
            if (selData[i].parentName !== null) {
              let a = this.getParents(this.menuList, selData[i].parentName)
              if (a.length >= 1) {
                for (let j = 0; j < a.length; j++) {
                  this.selMenus.push(a[j])
                }
              } else {
                this.selMenus.push(a)
              }
              this.selMenus.push(selData[i].menuId)
            } else {
              this.selMenus.push(selData[i].menuId)
            }
          }
          this.selMenus = this.$GlobalApi.unrepet(this.selMenus)
          // this.$GlobalApi.log('aaaaaaaaaaaaaaaaaaaaaaaaaa', this.selMenus)
        }
      },
      getSelectRecords ({selection, checked, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell}) {
        this.selectionDatas = selection
      },
      checkMenuBu () {
        this.menuLoading = true
        this.checkMenus = []
        let a = ''
        let getCk = []
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams({
            isuse: 1
          })
        }).then(({data}) => {
          this.MenuDatas = data
          this.menuList = treeDataTranslate(data, 'menuId')
        })
        this.checkMenu = true
        // this.$GlobalApi.log('this.editDatas.menuIds', this.editDatas.menuIds)
        this.checkMenus = this.editDatas.menuIds
        this.menuLoading = false
      },
      init (id) {
        // this.flag = 0
        this.dataForm.roleId = id || ''
        this.$GlobalApi.log(this.dataForm.roleId)
        if (id) {
          this.isEdit = true
        } else {
          this.isEdit = false
        }
        if (this.isEdit) {
          this.depLoading = true
        }
        this.visible = true

        if (this.isEdit) {
          this.$GlobalApi.log(this.dataForm.roleId)
          this.$http({
            url: this.$http.adornUrl(`/sys/role/get/${this.dataForm.roleId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              Object.assign(this.dataForm, data.role)
              this.depLoading = false
              this.editDatas = data.role
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$nextTick(() => {
            if (this.list.length == '0') {
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        if(this.selMenus.size === 0 && this.checkMenus.size!==0){
          this.findParents(this.checkMenus)
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/${this.isEdit ? 'update' : 'add'}`),
              method: 'post',
              data: this.$http.adornData({
                roleId: this.dataForm.roleId,
                roleName: this.dataForm.roleName,
                isuse: this.dataForm.isuse,
                menuIdList: this.selMenus,
                action: this.isEdit ? 'mod' : 'add'
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$message.success(this.isEdit ? '修改成功' : '新增成功')
                this.$emit('refreshDataList')
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .role-permission >>> .el-form-item__content {
    max-height: 500px;
    overflow-y: auto;
  }

  .click-table .el-table__body .el-table__row > td.elx_checked {
    box-shadow: inset 0 0 6px #409EFF;
  }

  .click-table-oper {
    margin-bottom: 18px;
  }

  .click-table-pagination {
    margin-top: 18px;
    text-align: right;
  }

  .click-table .drag-btn {
    font-size: 16px;
    cursor: move;
  }

  .click-table.elx-editable .elx-editable-row.new-insert,
  .click-table.elx-editable .elx-editable-row.new-insert:hover > td {
    background-color: #f0f9eb;
  }

  .click-table .el-table__body tr.hover-row > td,
  .click-table .el-table__body .el-table__row:hover > td {
    background-color: inherit;
  }

  .click-table.elx-editable .elx-editable-row.sortable-ghost,
  .click-table.elx-editable .elx-editable-row.sortable-chosen {
    background-color: #fff6b2;
  }
</style>
