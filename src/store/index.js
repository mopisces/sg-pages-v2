import Vuex from 'vuex'

Vue.use(Vuex)

const modules = {}

const files = require.context("./modules", false, /\.js$/)

files.keys().forEach((key) => {
	modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default
})

Object.keys(modules).forEach((key) => {
	modules[key]["namespaced"] = true;
})

const store = new Vuex.Store({
	modules,
})

export default store