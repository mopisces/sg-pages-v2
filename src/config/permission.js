import router from "@/router"
import store from "@/store"
import getPageTitle from "@/utils/pageTitle"

import { recordRoute, routesWhiteList } from "@/config/setting"

router.beforeResolve(async (to, from, next) => {
	let hasToken = store.getters["user/accessToken"]
	if (hasToken) {
		if (to.path === "/login"){
			next({ path: "/" })
		} else {
			const hasPermissions = store.getters["user/permissions"] &&
			store.getters["user/permissions"].length > 0
			if (hasPermissions) {
				next()
			} else {
				try {
					let permissions
					permissions = store.getters["user/permissions"]

					let accessRoutes = []
					accessRoutes =  accessRoutes = await store.dispatch(
						"routes/setRoutes",
						permissions
					)

					router.addRoutes(accessRoutes)
					next({ ...to, replace: true })
				}catch(err){
					await store.dispatch("user/resetAccessToken")
				}
			}
		}
	} else {
		if (routesWhiteList.indexOf(to.path) !== -1){
			next()
		} else {
			if (recordRoute) {
				next(`/login?redirect=${to.path}`)
			} else {
				next("/login")
			}
		}
	}
	document.title = getPageTitle(to.meta.title)
})