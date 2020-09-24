import qs from 'qs'
import Vue from 'vue'
import axios from 'axios'

export function postByFormDataApi(url, formData) {
    return axios.post(window.SITE_CONFIG.baseUrl + url,formData,{
		headers:{'Content-Type':'multipart/form-data','token': Vue.cookie.get('token')}
	})
}
