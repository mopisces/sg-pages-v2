import { getFactoryName, setFactoryName, removeFactoryName } from '@/utils/factory'

const state = {
	factoryName:getFactoryName(),
	
}

const getters = {
	factoryName: (state) => state.factoryName,
	
}

const mutations = {
	setFactoryName(state, factoryName) {
		state.factoryName = factoryName
		setFactoryName(factoryName)
	}
}

const actions = {
	setFactoryName( { commit }, factoryName){
		commit("setFactoryName", factoryName)
	},
	resetFactoryName({ commit }){
		commit("setFactoryName", "")
		removeFactoryName()
	},
	setWgddDate( { commit }, date ){
		commit("setMinDate", date.setMinDate)
		commit("setMaxDate", date.maxDate)
		commit("setBeginDate", date.beginDate)
		commit("setEndDate", date.endDate)
	}
}

export default { state, getters, mutations, actions }