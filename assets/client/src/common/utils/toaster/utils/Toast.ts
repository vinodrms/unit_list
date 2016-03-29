export enum ToastType {
	Success,
	Error,
	Info
}


var ToastClasses: { [index: number]: string; } = {};
ToastClasses[ToastType.Success] = "success";
ToastClasses[ToastType.Info] = "info";
ToastClasses[ToastType.Error] = "error";

export class Toast {
	id: number;
	toastClass: string;
	constructor(public type: ToastType, public message: string, public title?: string) {
		this.toastClass = ToastClasses[type];
	}
}