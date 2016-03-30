import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {BaseComponent} from '../../../../../common/base/BaseComponent';
import {WizardHeaderComponent} from '../pages/utils/header/WizardHeaderComponent';
import {WizardNavbarComponent} from '../pages/utils/navbar/WizardNavbarComponent';
import {WizardStepsComponent} from '../pages/utils/wizard-steps/WizardStepsComponent';
import {WizardBasicInformationComponent} from '../pages/wizard-pages/basic-information/main/WizardBasicInformationComponent';
import {WizardBedsComponent} from '../pages/wizard-pages/beds/WizardBedsComponent';

import {WizardBasicInformationStateService} from '../pages/wizard-pages/basic-information/main/services/WizardBasicInformationStateService';
import {WizardBasicInfoIntroService} from '../pages/wizard-pages/basic-information/pages/intro/services/WizardBasicInfoIntroService';
import {WizardBasicInfoOverviewService} from '../pages/wizard-pages/basic-information/pages/overview/services/WizardBasicInfoOverviewService';
import {WizardBasicInfoPaymentsAndPoliciesService} from '../pages/wizard-pages/basic-information/pages/payments-policies/services/WizardBasicInfoPaymentsAndPoliciesService';
import {WizardBedsStateService} from '../pages/wizard-pages/beds/services/WizardBedsStateService';
import {WizardService} from '../pages/wizard-pages/services/WizardService';

@RouteConfig([
	{ path: '/basic-info/...', name: 'WizardBasicInformationComponent', component: WizardBasicInformationComponent, useAsDefault: true },
	{ path: '/beds', name: 'WizardBedsComponent', component: WizardBedsComponent }
])

@Component({
	selector: 'main-wizard-component',
	templateUrl: '/client/src/pages/internal/containers/wizard/main/template/main-wizard-component.html',
	directives: [RouterOutlet, WizardHeaderComponent, WizardNavbarComponent, WizardStepsComponent],
	providers: [WizardBasicInfoIntroService, WizardBasicInfoOverviewService, WizardBasicInfoPaymentsAndPoliciesService, 
		WizardBasicInformationStateService, WizardBedsStateService, WizardService]
})

export class MainWizardComponent extends BaseComponent {
	constructor() {
		super();
	}
}