import request from "@/utils/request"
import { getFactoryName } from '@/utils/factory'

export function login(data)
{
	const postData = Object.assign( {}, data, { factory_name : getFactoryName() } )
	return request({
		url: "/pm/login/login",
    	method: "post",
    	data:postData
	})
}

export function getUserInfo()
{
	return request({
		url: "/pm/login/userInfo",
    	method: "post"
	})
}