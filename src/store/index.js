import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import user from './modules/user'
import keyState from './modules/keyState'
import Cookie from 'vue-cookie'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    childMenuIdx: '',
    menuId:'',
    // MyMaps: Cookie.get('token') ? JSON.parse(localStorage.getItem("myMapInfo")) : [],
    menproj:[],
  },
  modules: {
    common,
    user,
    keyState
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
    },
    childMenuIdx(state,infos){
      state.childMenuIdx = infos;
    },
    menuId(state,menuid){
      state.menuId = menuid;
    },
    // MyMaps(state,myMapin){
    //   localStorage.setItem('myMapInfo', JSON.stringify(myMapin));
    //   state.MyMaps = myMapin;
    // },
    menproj(state,menprojin){
      state.menproj = menprojin;
    },
  },
  getters:{

  },
  strict: process.env.NODE_ENV !== 'production'
})
