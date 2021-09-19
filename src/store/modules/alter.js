const state = {
	//alterValue:[]
	alterValue:{}
}

const getters = {
	alterValue:state => state.alterValue
}

const mutations = {
	/*setAlertValue( state, value ){
		if( value.type == 'push' ){
			if( !state.alterValue[value.configIndex] ){
				state.alterValue[value.configIndex] = [];
			}
			state.alterValue[value.configIndex].push(value.record);
		}
		if( value.type == 'clear' ){
			state.alterValue[value.configIndex] = [];
		}
	},*/
	setAlterValue( state, data ){
		state.alterValue[ data.db_item ].push( data.record )
	},
	setClear( state, data ){
		state.alterValue[ data.db_item ] = []
	},
	setInitAlterValue( state, alterValue ){
		state.alterValue = alterValue
	}
}

const actions = {
	async initAlter( { commit, state }, dbItem ){
		var alter = new Object()

		dbItem.forEach((item,idx)=>{
			alter[idx] = []
		})

		await commit('setInitAlterValue', alter)
	}
}

export default { state, getters, mutations, actions }