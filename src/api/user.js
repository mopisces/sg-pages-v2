import request from "@/utils/request"

export function getList()
{
	return request({
		url: "/pm/user/list",
    	method: "post"
	})
}

export function doEdit(data)
{
	return request({
		url: "/pm/user/doEdit",
    	method: "post",
    	data:data
	})
}

export function doStatus(data)
{
	return request({
		url: "/pm/user/doStatus",
    	method: "post",
    	data:data
	})
}