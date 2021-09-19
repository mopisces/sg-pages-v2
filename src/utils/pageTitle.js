import { title } from "@/config/settings"

export default function getPageTitle(pageTitle) {
	if (pageTitle) {
		return `${pageTitle}-${title}`
	}
	return `${title}`
}