import { getAccessToken, removeAccessToken, setAccessToken } from "@/utils/accessToken"
import { login, getUserInfo } from '@/api/login'
import { tokenName } from "@/config/setting"
import { resetRouter } from "@/router"

const state = {
	accessToken:getAccessToken(),
	username:"",
	permissions:[]
}

const getters = {
	accessToken: (state) => state.accessToken,
	username: (state) => state.username,
	permissions: (state) => state.permissions,
}

const mutations = {
	setAccessToken(state, accessToken) {
		state.accessToken = accessToken
		setAccessToken(accessToken)
	},
	setUsername(state, username) {
		state.username = username
	},
	setPermissions(state, permissions) {
		state.permissions = permissions
	}
}
	
const actions = {
	async login({ commit },userInfo){
		const { token } = await login(userInfo)
		if (token) {
			commit("setAccessToken", token)
		} else {
			vant.Toast.loading({
				duration: 1000, 
			    forbidClick: true,
			    message: "登录接口异常",
			    overlay:true
			})
		}
	},
	async getUserInfo({ commit, state }){
		const { result } = await getUserInfo()
		if (!result) {
			return false;
		}
		let { permissions, username  } = result
		let role = new Array();
		role.push( Number(permissions) )

		if ( role && username ){
			commit("setPermissions", JSON.parse(JSON.stringify(role)) )
			commit("setUsername", username)
			return JSON.parse(JSON.stringify(role))
		} else {
			vant.Notify({
				type: 'warning', 
				message: '用户信息接口异常'
			})
			return false
		}
	},
	async logout({ dispatch }) {
		await dispatch("resetAccessToken")
		await resetRouter()
	},
	resetAccessToken({ commit }){
		commit("setPermissions", [])
    	commit("setAccessToken", "")
   		removeAccessToken()
	}
}

export default { state, getters, mutations, actions }