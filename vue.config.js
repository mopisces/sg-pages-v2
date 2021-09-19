module.exports = {
	configureWebpack:{
		performance:{
			hints:'warning',
			maxEntrypointSize: 50000000,
			maxAssetSize: 30000000,
			assetFilter: function(assetFilename) {
				return assetFilename.endsWith('.js')
			}
		},
		externals:{
			'vue' : 'Vue',
			/*'vuex': 'vuex',*/
			'axios':'axios',
			'vue-router':'VueRouter'
		}
	},
	chainWebpack:(config)=>{
		config
			.plugin('html')
			.tap(args => {
				args[0].title= '佳鹏生管监控'
				return args
			})
	}
}