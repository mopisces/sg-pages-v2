import request from "@/utils/request"
import { getFactoryName } from '@/utils/factory'

export function getConfig()
{
	const data = {
		factory_name : getFactoryName()
	}
	return request({
		url: "/pm/common/getConfig",
    	method: "post",
    	data:data
	})
}