import store from '@/store'
import { isArray } from '@/utils/validate'
import qs from 'qs'
import { successCode } from "@/config/setting"


let loadingInstance

const errorHandler = {
	httpErr:(code)=>{
		let message
		switch (code) {
			case 400:
				message = '请求错误(400)'
				break;
			case 401:
				message = ''
				break;
			case 403:
				message = '拒绝访问(403)'
				break;
			case 404:
				message = '请求出错(404)'
				break;
			case 405:
				message = '请求为允许(405)'
				break;
			case 408:
				message = '请求超时(408)'
				break;
			case 500:
				message = '服务器错误(500)'
				break;
			case 501:
				message = '服务未实现(501)'
				break;
			case 502:
				message = '网络错误(502)'
				break;
			case 503:
				message = '服务不可用(503)'
				break;
			case 504:
				message = '网络超时(504)'
				break;
			case 505:
				message = 'http版本不受持支(505)'
				break;
			default:
				message = '链接出错'
		}
		vant.Notify({
			type: 'warning', 
			message: message
		})
	},
	serverErr:(code,msg)=>{
		/*switch(code){
			case 
		}*/
	}
}

const instance = axios.create({
	baseURL:'http://localhost:50000',
	timeout:1500,
	headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}
})

instance.interceptors.request.use((config)=>{
	if (store.getters['user/accessToken']){
		config.headers['Authentication'] = store.getters['user/accessToken']
	}
	if ( config.data ){
		config.data = qs.stringify(config.data)
	}
	loadingInstance = vant.Toast.loading({
		duration: 1000, 
	    forbidClick: true,
	    message: "加载中...",
	    overlay:true
	})
	return config
},(error)=>{
	return Promise.reject(error)
})

instance.interceptors.response.use(
	(response)=>{
		if (loadingInstance) loadingInstance.clear()

		const { data, config } = response
		const { code, msg } = data
		const codeVerificationArray = isArray(successCode)? [...successCode]:[...[successCode]]

		if (codeVerificationArray.includes(code)){
			return data
		} else {
			errorHandler.serverErr(code, msg)
			return Promise.reject()
		}
	},
	(error)=>{
		if (loadingInstance) loadingInstance.clear()

		const { response, message } = error
		if( error.response && error.response.dat ){
			const { status, data } = response
			errorHandler.httpErr(status)
			return Promise.reject(error)
		} else {
			let { message } = error

			if (message === "Network Error") {
				message = "后端接口连接异常"
			}
			if (message.includes("timeout")) {
				message = "后端接口请求超时"
			}
			if (message.includes("Request failed with status code")){
				const code = message.substr(message.length - 3)
				message = "后端接口" + code + "异常"
			}
			vant.Notify({
				type: 'warning', 
				message: message
			})
			return Promise.reject(error)
		}
	}
)

export default instance