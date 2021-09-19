var itemName = 'karry-sg-userInfo'

export function getToken()
{

	try{
		let userInfo = sessionStorage.getItem(itemName)
		return JSON.parse(userInfo).access_token
	}catch(err){
		return null
	}
}

export function setUserInfo( userInfo )
{
	return new Promise((resolve,reject)=>{
		try{
			sessionStorage.setItem( itemName, JSON.stringify(userInfo) )
			resolve('success')
		}catch(err){
			reject('fail')
		}
	})
}

export function getUserInfo()
{
	try{
		return JSON.parse(sessionStorage.getItem( itemName ))
	}catch(err){
		return null
	}
}

export function cleanUserInfo()
{
	sessionStorage.setItem( itemName, null)
}

export function secondsFormat( seconds )
{
	return [parseInt(seconds / 60 / 60), parseInt(seconds / 60 % 60), parseInt(seconds % 60)].join(':').replace(/\b(\d)\b/g, '0$1')
}

export function dateTimeFormat( datetime, format )
{
	let dt = new Date(datetime);
	let o = {
		'M+': dt.getMonth() + 1,
		'd+': dt.getDate(),
		'h+': dt.getHours(),
		'm+': dt.getMinutes(),
		's+': dt.getSeconds()
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
		}
	}
	return format
}

export function setFactoryKey( key )
{
	return new Promise((resolve,reject)=>{
		try{
			sessionStorage.setItem( 'jpdn-sg-key', key )
			resolve('success')
		}catch(err){
			reject('fail')
		}
	})
}

export function getFactoryKey()
{
	try{
		return sessionStorage.getItem( 'jpdn-sg-key' )
	}catch(err){
		return null
	}
}