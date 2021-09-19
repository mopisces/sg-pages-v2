import request from "@/utils/request"

export function getBl(data)
{
	return request({
		url: "/pm/select/getBl",
    	method: "post",
    	data:data
	})
}

export function getBlMS(data)
{
	return request({
		url: "/pm/select/getBlms",
    	method: "post",
    	data:data
	})
}

export function getScdd(data)
{
	return request({
		url: "/pm/select/getScdd",
    	method: "post",
    	data:data
	})
}

export function getWgdd(data)
{
	return request({
		url: "/pm/select/getWgdd",
    	method: "post",
    	data:data
	})
}