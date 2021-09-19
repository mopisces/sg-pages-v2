import request from "@/utils/request"

export function getValue(data)
{
	return request({
		url: "/pm/alert/getValue",
    	method: "post",
    	data:data
	})
}

export function changeVal(data)
{
	return request({
		url: "/pm/alert/changeValue",
    	method: "post",
    	data:data
	})
}