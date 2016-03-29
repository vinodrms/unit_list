import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
	selector: 'loading-component',
	template: `
		<center *ngIf="isLoading">
			<div>
				<img src="/client/static-assets/images/anim.gif" width="60" height="60" alt=""/>
			</div>
		</center>
	`,
	pipes: []
})

export class LoadingComponent {
	@Input() isLoading: boolean;

	constructor() {
		this.isLoading = false;
	}
}