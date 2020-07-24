/**
 * URL地址
 * @param {*} s
 */
function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}


let validPhone = (rule, value, callback) => {
  if (value == '' || value == undefined) {
    callback(new Error('请输入电话号码'))
  }
  var idcardReg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  if (!idcardReg.test(value)) {
    callback(new Error('请输入正确的11位手机号码'));
  } else {
    callback();
  }
};

/**
 * 密码强度校验
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */

let newPassword = (rule, value, callback) => {
  if (value == '' || value == undefined) {
    callback()
  }
  let idcardReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
  if (!idcardReg.test(value)) {
    callback(new Error('请输入长度6~16位且包含字母及数字的密码'))
  } else {
    callback()
  }
}

export default{
  isURL,
  validPhone,
  newPassword
}
