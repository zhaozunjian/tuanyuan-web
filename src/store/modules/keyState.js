export default {
  namespaced: true,
  state:{
    mbCode:'',
    goodsId:'',
    hjContract:{
      action:'',
      keyId:''
    },
    sjContract:{
      action:'',
      keyId:''
    },
    zlgContract:{
      action:'',
      keyId:''
    },
    djContract:{
      action:'',
      keyId:''
    },
    upContract:{
      action:'',
      keyId:''
    },
    ctnhjContract:{
      action:'',
      keyId:''
    },
    ctnsjContract:{
      action:'',
      keyId:''
    },
    ctnzlgContract:{
      action:'',
      keyId:''
    }
  },
  mutations:{
    updateState(state,{key,val}){
      state[key] = val;
    },
    updateStateObj(state , {key , keyVal}){
      if(!key)
        return;

      keyVal.forEach(item => {
        state[key][item.key] = item.val;
      })
    }
  }
}
