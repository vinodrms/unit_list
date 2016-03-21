import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../common/base/BaseComponent';

@Component({
	selector: 'external-footer-component',
	templateUrl: '/client/src/pages/external/pages/common/footer/template/external-footer-component.html'
})

export class ExternalFooterComponent extends BaseComponent {
	constructor() {
		super();
	}
}