const domain = {
	namespaced: true,

	state: {
		sg:null,
	},

	mutations:{
		setSg( state, sg ){
			state.sg = sg
		}
	}
}

export default domain