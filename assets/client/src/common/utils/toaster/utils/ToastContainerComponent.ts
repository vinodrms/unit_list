import {Component, Input, Optional, Inject} from 'angular2/core';
import {Toast} from './Toast';

@Component({
	selector: 'toast-container-component',
	template: `
    <div id="toast-container" class="toast-top-right" aria-live="polite" role="alert">
      <div *ngFor="#toast of toasts" class="toast-{{toast.toastClass}}" (click)="dismiss(toast)">
        <div *ngIf="toast.title" class="{{titleClass}}">{{toast.title}}</div>
        <div class="{{messageClass}}">{{toast.message}}</div>
      </div>
    </div>
    `
})
export class ToastContainerComponent {
	messageClass = 'toast-message';
	titleClass = 'toast-title';
	toasts: Toast[] = [];
	maxShown = 5;

	constructor() {
	}

	public addToast(toast: Toast) {
		this.toasts.push(toast);
		if (this.toasts.length > this.maxShown) {
			this.toasts.splice(0, (this.toasts.length - this.maxShown));
		}
	}
	public removeToast(toastId: number) {
		this.toasts = this.toasts.filter((toast) => {
			return toast.id !== toastId;
		});
	}
}