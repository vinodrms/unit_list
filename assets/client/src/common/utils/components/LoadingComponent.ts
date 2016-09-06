import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'loading-component',
	template: `
		<span class="horizontal-align-center" *ngIf="isLoading">
			<div>
				<i class="fa fa-spinner fa-pulse fa-3x"></i>
			</div>
		</span>
	`
})

export class LoadingComponent {
	@Input() isLoading: boolean;

	constructor() {
		this.isLoading = false;
	}
}