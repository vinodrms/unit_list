export class ThCookie {
	public static getCookie(name: string): string {
		let myWindow: any = window;
		name = myWindow.escape(name);
		let regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
		let result = regexp.exec(document.cookie);
		return (result === null) ? null : myWindow.unescape(result[1]);
	}
	public static setCookie(name: string, value: string, expires?: number, path?: string, domain?: string) {
		let myWindow: any = window;
		let cookieStr = myWindow.escape(name) + '=' + myWindow.escape(value) + ';';

		if (expires) {
			let dtExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
			cookieStr += 'expires=' + dtExpires.toUTCString() + ';';
		}
		if (path) {
			cookieStr += 'path=' + path + ';';
		}
		if (domain) {
			cookieStr += 'domain=' + domain + ';';
		}
		document.cookie = cookieStr;
	}
	public static deleteCookie(name: string, path?: string, domain?: string) {
		if (ThCookie.getCookie(name)) {
			ThCookie.setCookie(name, '', -1, path, domain);
		}
	}
}