import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../common/base/BaseComponent';

@Component({
	selector: 'external-footer-component',
	templateUrl: '/client/src/pages/external/pages/common/footer/template/external-footer-component.html'
})

export class ExternalFooterComponent extends BaseComponent {
	year: number;

	constructor() {
		super();
		this.updateYear();
	}
	private updateYear() {
		var d = new Date();
		this.year = d.getFullYear();
	}
}