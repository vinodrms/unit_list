import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../localization/TranslationPipe';

@Component({
	selector: 'loading-button',
	template: `
		<button class="btn btn-primary btn-lg submit" type="submit" (click)="didClickButton()">
			<i *ngIf="isLoading" class="fa fa-spinner fa-pulse"></i>
			{{ title | translate }}
		</button>
	`,
	pipes: [TranslationPipe]
})

export class LoadingButtonComponent {
	@Input() isLoading: boolean;
	@Input() title: string;
	@Output() didClick: EventEmitter<any> = new EventEmitter();

	constructor() {
		this.isLoading = false;
		this.title = "";
	}

	didClickButton() {
		this.didClick.next(null);
	}
}