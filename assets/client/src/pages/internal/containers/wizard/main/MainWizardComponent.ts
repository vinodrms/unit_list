import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../common/base/BaseComponent';


@Component({
	selector: 'main-wizard-component',
	templateUrl: '/client/src/pages/internal/containers/wizard/main/template/main-wizard-component.html'
})

export class MainWizardComponent extends BaseComponent {
	constructor() {
		super();
	}
}