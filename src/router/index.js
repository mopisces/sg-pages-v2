import { publicPath, routerMode, recordRoute, routesWhiteList, title } from "@/config/setting"
import store from "@/store"
/*import getPageTitle from "@/utils/pageTitle.js"*/

Vue.use(VueRouter)

export const constantRoutes = [
	{
        path : '/login',
        component: () => import('@/views/login/Index'),
        name:'login',
        meta:{ title: '登录' }
    },
    {
        path:'*',
        component:() => import('@/views/404'),
        meta:{ title:'您访问的页面不存在' }
    }
]

export const asyncRoutes = [
	{
    	path:'/sg',
    	component:() => import('@/components/layouts/Index'),
    	meta:{ title:'生管布局' },
        children:[
            {
                path : 'monitor',
                meta : { title: '生产线数据' },
                icon : 'volume-o',
                name : 'monitor',
                component: () => import('@/views/monitor/Index'),
            },
            {
                path : 'bl',
                meta : { title: '备料' },
                icon : 'points',
                name : 'bl',
                component: () => import('@/views/select/BL'),
            },
            {
                path : 'blms',
                meta : { title: '备料米数' },
                icon : 'orders-o',
                name : 'blms',
                component: () => import('@/views/select/BLMS'),
            },
            {
                path : 'scdd',
                meta : { title: '生产订单' },
                icon : 'records',
                name : 'scdd',
                component: () => import('@/views/select/SCDD'),
            },
            {
                path : 'wgdd',
                meta : { title: '完工订单' },
                icon : 'completed',
                name : 'wgdd',
                component: () => import('@/views/select/WGDD'),
            },
            {
                path : 'menu',
                meta : { title: '菜单', permissions:[0,1] },
                icon : 'wap-home-o',
                name : 'menu',
                component: () => import('@/views/menu/Index'),
            },
            {
                path : 'user',
                meta : { title: '用户管理', permissions:[0,1] },
                menuIcon : 'friends-o',
                name : 'user',
                component: () => import('@/views/user/Index'),
            },
            {
                path : 'statis',
                meta : { title: '生产进度', permissions:[0,1] },
                menuIcon : 'chart-trending-o',
                name : 'statis',
                component: () => import('@/views/statis/Index'),
            },
            {
                path : 'alter',
                meta : { title: '修改', permissions:[0] },
                menuIcon : 'setting-o',
                name : 'alter',
                component: () => import('@/views/alter/Index'),
            }
        ]
    }
]

function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle}-${title}`
    }
    return `${title}`
}

const router = new VueRouter({
	base: routerMode === "history" ? publicPath : "",
	mode: routerMode,
	scrollBehavior:() => ({
		y: 0
	}),
	routes: constantRoutes
})

router.beforeResolve(async (to, from, next) => {
    let hasToken = store.getters["user/accessToken"]
    
    if (hasToken) {
        let dbItem = store.getters["layout/dbItem"]
        if( Array.prototype.isPrototypeOf(dbItem)&&dbItem.length === 0 ){
            await store.dispatch("layout/getSelectConfig")
        }
        if (to.path == "/login"){
            next({ path: "/sg/monitor" })
        } else {
            const hasPermissions = store.getters["user/permissions"] &&
            store.getters["user/permissions"].length > 0
            if (hasPermissions) {
                next()
            } else {
                try {
                    let permissions
                    permissions = await store.dispatch("user/getUserInfo")
                    
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
            if (recordRoute && to.query.factoryName) {
                next(`/login?factoryName=${to.path}`)
            } else {
                next("/login")
            }
        }
    }
    document.title = getPageTitle(to.meta.title)
})

export function resetRouter() {
	router.matcher = new VueRouter({
		base: routerMode === "history" ? publicPath : "",
		mode: routerMode,
		scrollBehavior:() => ({
			y: 0
		}),
		routes: constantRoutes
	}).matcher
}

export default router