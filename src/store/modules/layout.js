import { getConfig } from '@/api/common'

const state = {
	factoryName:null,
	title:'',
	active:'',
	container:{
		height:null,
		width:null
	},
	dropDownIndex:0,
	dbItem:[],
	weight:0, //备料米数是否安重量查看
	statis:{
		selectable:[],
		totalLine:[],
		date:null
	},
	configStatus:false,
	wgdd:{
		minDate:null,
		maxDate:null,
		beginDate:null,
		endDate:null
	}
}

const getters = {
	factoryName:state => state.factoryName,
	title: state => state.title,
	active: state => state.active,
	height:state => state.container.height,
	width: state => state.container.width,
	dropDownIndex: state => state.dropDownIndex,
	dbItem: state => state.dbItem,
	weight: state => state.weight,

	totalLine:state => state.statis.totalLine,
	selectable:state => state.statis.selectable,
	statisData:state => state.statis.date,

	minDate:(state)=> state.wgdd.minDate,
	maxDate:(state)=> state.wgdd.maxDate,
	beginDate:(state)=> state.wgdd.beginDate,
	endDate:(state)=> state.wgdd.endDate,
	wgdd:(state)=> state.wgdd,
}

const mutations = {
	setFactoryName(state, factoryName){
		state.factoryName = factoryName
	},
	setTitle(state, title){
		state.title = title
	},
	setActive(state,active){
		state.active = active
	},
	setHeight( state, height ){
		state.container.height = height
	},
	setWidth( state, width ){
		state.container.width = width
	},
	setDropDownIndex(state, index){
		state.dropDownIndex = index
	},
	setDbItem( state, dbItem ){
		state.dbItem = dbItem
	},
	setWeight( state, weight ){
		state.weight = weight
	},

	setStatis( state, statis){
		state.statis.selectable = statis.selectable
		state.statis.totalLine = statis.totalLine
		state.statis.date = statis.date
	},
	setConfigStatus( state,status ){
		state.configStatus = status
	},
	setStatisBeginData(state, beginDate){
		state.statis.date.beginDate = beginDate
	},
	setStatisEndData(state, endDate){
		state.statis.date.endDate = endDate
	},

	setMinDate(state, minDate){
		state.wgdd.minDate = minDate
	},
	setMaxDate(state, maxDate){
		state.wgdd.maxDate = maxDate
	},
	setBeginDate(state, beginDate){
		state.wgdd.beginDate = beginDate
	},
	setEndDate(state, endDate){
		state.wgdd.endDate = endDate
	},
	setWgddDate( state, date ){
		state.wgdd = date
	}
}

const actions = {
	async setWgddDate({ commit, state }, date){
		await commit("setWgddDate",date)
	},
	async getSelectConfig({ commit, dispatch }, params){
		let dbItem = [],totalLine = [], selectable = []
		const { result } = await getConfig()
		result.dbItem.forEach((item,index)=>{
			dbItem.push({text:item.flag,value:index,isnew:item.isnew,updown:item.updown,socketUrl:item.udp})
		})
		result.statis.line.forEach((item,idx)=>{
			totalLine.push({value:item.value, text:item.text, isnew:item.isnew})
			if( item.isnew == 1 ){
				selectable.push(idx)
			}
		})
		await commit('setStatis',{ totalLine:totalLine, selectable:selectable, date:result.statis.date})
		await commit('setFactoryName', result.info.name)
		await commit('setDbItem', dbItem)
		await commit('setWeight', result.info.weight)
		await commit('setConfigStatus', true)
		await commit("setWgddDate",result.wgdd)

		await dispatch('alter/initAlter',dbItem,{ root:true })

	}
}

export default { state, getters, mutations, actions }