const setting = {
	// 开发以及部署时的URL
	publicPath: "",
	// 路由模式，可选值为 history 或 hash
	routerMode: "history",
	//不经过token校验的路由
  	routesWhiteList: ["/login", "*"],
  	//标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
	title:'佳鹏科技',
	//token名称
	tokenName:'access_token',
	//token失效回退到登录页时是否记录本次的路由
	recordRoute: true,
	//是否开启登录拦截
	loginInterception: true,
	//操作正常code
	successCode: [ 20000 ]
}

module.exports = setting
