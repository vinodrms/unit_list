export class NotificationsModalInput {
	private _preselectedNotification: any;
	public get preselectedNotification(): any {
		return this._preselectedNotification;
	}
	public set preselectedNotification(preselectedNotification: any) {
		this._preselectedNotification = preselectedNotification;
	}
}