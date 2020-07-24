<template>
  <div class="pager">
    <el-pagination
      :pager-count="5"
      style="margin:0px;"
      v-model.lazy="currentPageprovinc"
      @size-change="handleSizeChange"
      @current-change="currentChange"
      :current-page.sync="currentPageprovinc"
      :page-sizes="pgsizes"
      :page-size="pgsize"
      :layout="layout"
      :total="sum"
      :small="small"
      :background="background">
    </el-pagination>
  </div>
</template>

<script>
    export default {
        name: "Pager" ,
        data () {
          return {
            currentPageprovinc : this.currentPage,
            pgsizes : this.pageSizes,
            pgsize : this.pageSize,
            sum : this.total
          }
        },
        props : {
          background:{
            type : Boolean,
            default : true
          },
          currentPage : {
            type : Number ,
            default : 1
          } ,
          pageSizes : {
            type : Array,
            default () {
              return [10,20,30,40,50]
            }
          },
          pageSize : {
            type : Number,
            default : 50
          },
          total : {
            type : Number,
            default : 0
          },
          layout : {
            type : String ,
            default : "total, sizes, prev, pager, next, jumper"
          },
          small : Boolean
        },
        watch : {
          pageSizes : {
            handler(newValue,oldValue){
              this.pgsizes = newValue;
            },
            deep:true
          },
          total (newValue) {
            this.sum = newValue;
          },
          currentPage(newVal){
            this.currentPageprovinc = newVal;
          },
          pageSize(newVal){
            this.pgsize = newVal;
          }
        },
        methods : {
          handleSizeChange(val){
            this.$emit('handle-size-change', val);
          },
          currentChange(val){
            this.$emit('current-change', val);
          }
        }
    }
</script>

