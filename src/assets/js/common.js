/**
 * @author zhaozunjian
 * @date 2020/7/11 16:20
 * @description 组件封装
 */
import {MessageBox, Notification} from 'element-ui'
import storage from 'good-storage'
import httpRequest from '@/utils/httpRequest'
import Vue from 'vue'
import router from '@/router'
import {clearLoginInfo} from '@/utils'

/**
 * 全局变量
 * @type {number}
 */
const logStatus = 2  //调试信息打印 1、发布  2、debug

/**
 * table表头样式
 * */
function rowClass() {
  return {backgroundColor: '#EFEFEF', color: '#000', borderColor: '#FFF', textAlign: 'center'};
}

/**
 * table单元格样式
 * */
function cellClass() {
  return {paddingBottom: '2px', paddingTop: '2px', textAlign: 'center'};
}

function cellClassNoEdit() {
  return {paddingBottom: '7px', paddingTop: '7px', textAlign: 'center'}
}

/**
 * 生日转换
 * @param strBirthday 被转换日期
 * @return 年龄Number
 * */
function jsGetAge(strBirthday) {
  var returnAge
  var strBirthdayArr = strBirthday.split('-')
  var birthYear = strBirthdayArr[0]
  var birthMonth = strBirthdayArr[1]
  var birthDay = strBirthdayArr[2]
  var d = new Date()
  var nowYear = d.getFullYear()
  var nowMonth = d.getMonth() + 1
  var nowDay = d.getDate()
  if (nowYear == birthYear) {
    returnAge = 0//同年 则为0岁
  } else {
    var ageDiff = nowYear - birthYear //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay//日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        var monthDiff = nowMonth - birthMonth//月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      }
    } else {
      returnAge = -1//返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge//返回周岁年龄
}

/**
 * 是否为NaN
 * @param obj
 * @returns {boolean}
 */
function isNaN(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]' && obj !== +obj
}

/**
 * 是否为null
 * @param obj
 * @returns {boolean}
 */
function isNull(obj) {
  return (obj === null) || (obj == 'null')
}

/**
 * 是否为undefined
 * @param obj
 * @returns {boolean}
 */
function isUndefined(obj) {
  return obj === void 0
}

/**
 * 判断是否为空/未定义/NaN/""包含空字符串
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
  if (isNaN(obj) || isNull(obj) || isUndefined(obj) || ((Object.prototype.toString.call(obj) === '[object String]') && obj === '')) {
    return true
  } else {
    return false
  }
}

// Is a given variable an object?
function isObject(obj) {
  var type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

/**
 * 空对象{} [] 字符串类型
 * @param obj
 * @returns {boolean}
 */
function isEmptyObj(obj) {
  if (Object.keys(obj)) {
    return true
  } else {
    return false
  }
}

/**
 * 打印日志
 * @param msg 日志描述
 * @param obj 日志信息
 */
function log(msg, obj) {
  if (logStatus == 2) {
    try {
      if (!msg) {
        msg = ''
      }
      console.log('[Debug Log]==> ', msg, '  ', obj)
    } catch (e) {

    }
  }
}

/**
 * 弹出提示框
 * @param msg 提示框内容
 * @param title 提示框标题
 * @param type 提示框样式 0:成功,1:警告,2:信息,3:失败
 * */
function confirmMsg(msg, title, type) {
  switch (type) {
    case 0: {
      type = 'success'
      break
    }
    case 1: {
      type = 'warning'
      break
    }
    case 2: {
      type = 'info'
      break
    }
    case 3: {
      type = 'error'
      break
    }
  }
  !type ? type = 'success' : type = type
  return new Promise((resolve, reject) => {
    MessageBox.confirm(msg, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: type
    }).then(() => {
      resolve(true)
    }).catch(() => {
      resolve(false)
    })
  })
}

/**
 * 日期格式化
 * @param date 日期
 * @param pattern 格式
 * @returns {string}
 */
function dateToString(date = new Date(), pattern = 'yyyy-MM-dd HH:mm:ss') {
  let year = date.getFullYear()//年
  let month = date.getMonth() + 1//月
  let day = date.getDate()//日
  let hours = date.getHours()//时
  let min = date.getMinutes()//分
  let second = date.getSeconds()//秒

  if (pattern === 'yyyy-MM-dd HH:mm:ss') {
    let m = month.toString().length === 1 ? '0' + month : month
    let d = day.toString().length === 1 ? '0' + day : day
    let hh = hours === 0 ? '00' : hours.toString()
    let mm = min === 0 ? '00' : min.toString()
    let ss = second === 0 ? '00' : second.toString()
    return year + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }else {
    let m = month.toString().length === 1 ? '0' + month : month
    let d = day.toString().length === 1 ? '0' + day : day

    return year + '-' + m + '-' + d
  }

}

/**
 * 消息提示框
 * @param title 提示框标题
 * @param msg 提示框内容
 * @param seat 提示框显示位置 0:右上角,1:右下角,2:左下角,3:左上角
 * @param type 提示框样式 0:成功,1:警告,2:信息,3:失败
 * @param time 提示框关闭时间
 * */
function alertMsg(title, msg, seat, type, time) {
  switch (seat) {
    case 0: {
      seat = 'top-right'
      break
    }
    case 1: {
      seat = 'bottom-right'
      break
    }
    case 2: {
      seat = 'bottom-left'
      break
    }
    case 3: {
      seat = 'top-left'
      break
    }
  }
  switch (type) {
    case 0: {
      type = 'success'
      break
    }
    case 1: {
      type = 'warning'
      break
    }
    case 2: {
      type = 'info'
      break
    }
    case 3: {
      type = 'error'
      break
    }
  }
  !time ? time = 4500 : time = time
  !seat ? seat = 'bottom-right' : seat = seat
  !type ? type = 'success' : type = type
  Notification({
    dangerouslyUseHTMLString: true,//解析html标签
    title: title,
    message: msg,
    position: seat,
    type: type,
    duration: time
  })
}


/**
 * 获取时间
 * fortime(nowtime(0))  现在的时间
 * fortime(nowtime(1))  半小时前
 * fortime(nowtime(2))  一小时前
 * fortime(nowtime(3))  一个半小时前
 * fordate 年月日
 * forhour 时分
 **/

function add(m) {
  return m < 10 ? '0' + m : m
}

//将时间戳转为普通格式
function fortime(shijianchuo) {
  var time = shijianchuo;
  if(!(shijianchuo instanceof Date))
    time = new Date(shijianchuo)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + add(m) + '-' + add(d) + ' ' + add(h) + ':' + add(mm) + ':' + add(s)
}

function fordate(shijianchuo) {
  var time = shijianchuo;
  if(!(shijianchuo instanceof Date))
    time = new Date(shijianchuo)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  return y + '-' + add(m) + '-' + add(d)
}

function forhour(shijianchuo) {
  var time = shijianchuo;
  if(!(shijianchuo instanceof Date))
    time = new Date(shijianchuo)
  var h = time.getHours()
  var mm = time.getMinutes()
  return add(h) + ':' + add(mm)
}

function nowtime(n) {
  var sc_now = n;
  if(!(n instanceof Date))
    sc_now = new Date(n)
  // var sc_now = timer.getTime()  //现在时间戳
  var timer1 = new Date(1800000 * n)  //半小时时间戳   用现在的时间戳减去半个小时前的时间戳得到了半个小时时间戳
  var sc_now1 = timer1.getTime()
  return sc_now - sc_now1  //半小时前的时间戳
}

function parseDate(date){
  var t = Date.parse(date);
  if (!isNaN(t)) {
    return new Date(Date.parse(date.replace(/-/g, "/")));
  } else {
    return new Date();
  }
}

/**
 *获取本周日期
 *
 * **/
function getthisweekdate() {
  const dateOfToday = Date.now()
  const dayOfToday = (new Date().getDay() + 7 - 1) % 7
  const daysOfThisWeek = Array.from(new Array(7))
    .map((_, i) => {
      const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
      return date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0')
    })
  return daysOfThisWeek
}
/**
 *获取本月日期
 *
 * **/
function getthismonthdate() {

  var now = new Date(); //当前日期
  var nowMonth = now.getMonth(); //当前月
  var nowYear = now.getFullYear(); //当前年
  var monthStartDate = new Date(nowYear, nowMonth, 1);

//获得本月的结束日期
  var days = (new Date(nowYear, nowMonth, 1) - new Date(nowYear, nowMonth, 1)) / (1000 * 60 * 60 * 24);
  var monthEndDate = new Date(nowYear, nowMonth +1, days);

  return [monthStartDate, monthEndDate]; //返回当月时间
}

/**
 * 获取服务器地址
 * **/
function getServerUrl(url) {
  let server = window.SITE_CONFIG.baseUrl
  if (url == null) {
    return server
  } else {
    return server + url
  }

}

/**
 * 获取用户token
 *@return {token:value}
 * **/
function getUserToken() {
  return {token: Vue.cookie.get('token')}
}

function clearForm(form) {
  this.$refs[form].resetFields()
}

function getWinHeight() {
  var winHeight
  if (window.innerHeight) {
    winHeight = window.innerHeight
  } else if ((document.body) && (document.body.clientHeight)) {
    winHeight = document.body.clientHeight
  }
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    winHeight = document.documentElement.clientHeight
  }
  return winHeight
}

function getCascadeData(data, ids, field) {
  if (!data || !ids)
    return [];
  if (!field)
    field = ["code", "name"];

  let idList = ids.split(",");
  let rtnData = [];
  // data.forEach((item, index, arr) => {
  getCascadeNode(rtnData, data, [], idList, field);
  // });
  return rtnData;
}

function getCascadeNode(rtnData, data, cascade, ids, field) {
  if (!data || !ids)
    return;
  data.forEach((item, index) => {
    ids.forEach(function (v, k) {
      if (item[field[0]] == v)
        rtnData.push(cascade.concat(v));
    });
    if (item["children"] && item["children"].length > 0) {
      getCascadeNode(rtnData, item["children"], cascade.concat(item[field[0]]), ids, field);
    }
  });
  return rtnData;
}

function getFormatData(data, idx) {
  if (!data)
    return "";
  idx = idx ? idx : 1;
  let datas = data.split(":");
  return;
}

/**
 * 全局获取当前登录用户信息
 * **/
function getUserInfo() {
  if (storage.has('userInfo')) {
    return storage.get('userInfo')
  } else {
    clearLoginInfo()
    router.push({name: 'login'})
  }
}
/**
 * 数组去重
 * @param array 数组
 * */
function unrepet(array) {
  var n = {}, r = [], val, type
  for (var i = 0; i < array.length; i++) {
    val = array[i]
    type = typeof val
    if (!n[val]) {
      n[val] = [type]
      r.push(val)
    } else if (n[val].indexOf(type) < 0) {
      n[val].push(type)
      r.push(val)
    }
  }
  return r
}

/**
 * 将字符类型 转换number类型，并取 n 为小数
 * @param num 待转换的字符 , 需存在小数位 ， 如果不存在小数位返回的数值同样不会存在小数位
 * @param n 小数位
 * @returns {number}
 */
function toNumber( num = 0 , n = 0 ){
  if(n < 0)
    n = 0;

  if(isNaN(num))
    return num;

  return Number(Number(num).toFixed(n));
}

/**
 * 字典映射
 * **/
const Constants = {
  DIALOG_WIDTH:'30%',
  DICT: {
    PAGE: 1,
    LIMIT: 50,
    TOTAL: null,
  }
}

export default {

  Constants: Constants,
  rowClass,
  cellClass,
  jsGetAge,
  isNaN,
  isEmpty,
  isObject,
  log,
  confirmMsg,
  alertMsg,
  add,
    fordate,
  parseDate,
  getthisweekdate,
  getthismonthdate,
  dateToString,
  getServerUrl,
  getUserToken,
  clearForm,
  cellClassNoEdit,
  getWinHeight,
  getCascadeData,
  getUserInfo,
  unrepet,
}

