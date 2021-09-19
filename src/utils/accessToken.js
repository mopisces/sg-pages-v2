let tokenTableName = 'karry-sg'

export function getAccessToken() {
	return sessionStorage.getItem(tokenTableName)
}

export function setAccessToken(accessToken) {
	return sessionStorage.setItem(tokenTableName, accessToken)
}

export function removeAccessToken() {
	return sessionStorage.removeItem(tokenTableName)
}