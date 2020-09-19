<template>
  <div class="businessReport">
    <mt-header style="height: 40px;" fixed title="商家列表"></mt-header>

    <div style="width: 100%;height: 40px;margin-top: 40px;display: flex;">
      <el-input type="text" style="width: 80%;height:30px;padding: 5px 5px 5px 5px;" placeholder="请输入商家名称" v-model="searchContent"></el-input>
      <mt-button style="width:20%;margin: 5px auto;" @click.native="loadMore()">查询</mt-button>
    </div>
      <!--ul里面几个scoller就是无限滚动的几个api-->
    <ul class="mui-table-view" v-infinite-scroll="loadMore" :infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
        <!--li数据遍历循环部分-->
        <mt-cell is-link :title="item.businessName" v-for="(item, index) in list" :key="index">
          <span>{{item.businessCategoryName}}</span>
        </mt-cell>
        <!--底部判断是加载图标还是提示“全部加载”-->
        <div class="more_loading" v-show="!queryLoading">
          <label><mt-spinner type="fading-circle" color="#00ccff" :size="20" v-show="moreLoading&&!allLoaded"></mt-spinner></label>
          <label v-show="allLoaded">已全部加载</label>
        </div>
      </ul>
  </div>
</template>

<script>
    export default {
        name: "business",
      data(){
        return{
          searchContent:'',
          //初始化无限加载相关参数
          queryLoading: false,
          moreLoading: false,
          allLoaded: false,
          totalNum: 0,
          pageSize: 20,
          pageNum: 0,
          list:[]
        }
      },
      mounted(){
          this.loadMore();
      },
      methods:{
        //无限加载函数
        loadMore() {
          if(this.allLoaded){
            this.moreLoading = true;
            return;
          }
          if(this.queryLoading){
            return;
          }
          this.moreLoading = !this.queryLoading;
          this.pageNum++;
          this.$http({
            url: this.$http.adornUrl(`/business/list`),
            method: 'post',
            params: this.$http.adornParams({
              currentPage: this.pageNum,
              pageSize: this.pageSize,
              searchContent: this.searchContent
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.list = this.list.concat(data.result.data);
              this.allLoaded = this.list.length==data.result.pageModel.total;
            } else {
              this.$message.error(data.msg);
            }
            this.moreLoading = this.allLoaded;
          })
        }
      }
    }
</script>

<style scoped>
  .businessReport{
    overflow-y: scroll;
    height: calc(100vh - 5.5rem);
  }

  .more_loading{
    width: 100%;
    text-align: center;
  }

  .mui-table-view{
    padding: 0;
  }

</style>
