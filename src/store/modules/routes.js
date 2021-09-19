import { asyncRoutes, constantRoutes } from "@/router"

import { filterAsyncRoutes } from "@/utils/handleRoutes"

const state = { 
	routes: [] 
}

const getters = {
	routes: (state) => state.routes,
}

const mutations = {
	setRoutes(state, routes) {
		state.routes = constantRoutes.concat(routes)
	}
}

const actions = {
	async setRoutes({ commit }, permissions) {
		const finallyAsyncRoutes = await filterAsyncRoutes(
			[...asyncRoutes],
			permissions
		)
		commit("setRoutes", finallyAsyncRoutes)

		return finallyAsyncRoutes
	}
}

export default { state, getters, mutations, actions }