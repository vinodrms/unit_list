import {Injectable, DynamicComponentLoader, ComponentRef, ElementRef} from 'angular2/core';
import {IToaster} from './IToaster';
import {Toast, ToastType} from './utils/Toast';
import {ToastContainerComponent} from './utils/ToastContainerComponent';

@Injectable()
export class Toaster implements IToaster {
	private static ToasterTimeout = 4000;
	private _container: ComponentRef;
	private _toastIndex = 0;

	constructor(private _loader: DynamicComponentLoader) {
	}

	public bootstrap(elementRef: ElementRef) {
		this._loader.loadNextToLocation(ToastContainerComponent, elementRef)
			.then((ref) => {
				this._container = ref;
			});
	}
	private setupToast(toast: Toast) {
		if (!this._container) {
			console.error("Toaster not bootstrapped from root component!");
			return;
		}
		toast.id = ++this._toastIndex;
		this._container.instance.addToast(toast);
		this.createTimeout(toast.id);
	}
	private createTimeout(toastId: number) {
		setTimeout(() => {
			this.clearToast(toastId);
		}, Toaster.ToasterTimeout);
	}
	private clearToast(toastId: number) {
		let instance = this._container.instance;
		instance.removeToast(toastId);
	}

	public error(message: string, title?: string) {
		let toast = new Toast(ToastType.Error, message, title);
		this.setupToast(toast);
	}
	public success(message: string, title?: string) {
		let toast = new Toast(ToastType.Success, message, title);
		this.setupToast(toast);
	}
	public info(message: string, title?: string) {
		let toast = new Toast(ToastType.Info, message, title);
		this.setupToast(toast);
	}
}