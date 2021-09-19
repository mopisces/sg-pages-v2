function hasPermission(permissions, route) {
	if (route.meta && route.meta.permissions) {
		return permissions.some((role) =>{
			return route.meta.permissions.indexOf( role ) >= 0 ? true : false 	
		})
	} else {
		return true
	}
}

export function filterAsyncRoutes(routes, permissions) {
	const finallyRoutes = []
	routes.forEach((route) => {
		const item = { ...route }
		if (hasPermission(permissions, item)) {
			if (item.children) {
				item.children = filterAsyncRoutes(item.children, permissions)
			}
			finallyRoutes.push(item)
		}
	})
	return finallyRoutes
}