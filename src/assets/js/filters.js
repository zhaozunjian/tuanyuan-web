import moment from "moment"
const baseImgPath = 'http://qiniuimages.xiongcaiyouying.com/'
const getImg = img=>{
    return baseImgPath+img
}

const getTime=time =>{
    return moment(time).format('YYYY-MM-DD HH:mm:ss ')
}
export default {getImg,getTime}
