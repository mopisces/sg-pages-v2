export function setFactoryName( key )
{
	return new Promise((resolve,reject)=>{
		try{
			sessionStorage.setItem( 'sg_monitor_factoryName', key )
			resolve('success')
		}catch(err){
			reject('fail')
		}
	})
}

export function getFactoryName()
{
	try{
		return sessionStorage.getItem( 'sg_monitor_factoryName' )
	}catch(err){
		return null
	}
}

export function removeFactoryName()
{
	return sessionStorage.removeItem('sg_monitor_factoryName')
}