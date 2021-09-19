import request from "@/utils/request"

export function getStatisData(data)
{
	return request({
		url: "/pm/statis/getStatisData",
    	method: "post",
    	data:data
	})
}