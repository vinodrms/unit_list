import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {WizardBasicInfoIntroComponent} from '../pages/intro/WizardBasicInfoIntroComponent';
import {WizardBasicInfoOverviewComponent} from '../pages/overview/WizardBasicInfoOverviewComponent';
import {WizardBasicInfoPaymentsAndPoliciesComponent} from '../pages/payments-policies/WizardBasicInfoPaymentsAndPoliciesComponent';
import {WizardBasicInfoPropertyDetailsComponent} from '../pages/property-details/WizardBasicInfoPropertyDetailsComponent';
import {WizardBasicInformationStateService} from './services/WizardBasicInformationStateService';
import {WizardService} from '../../services/WizardService';

@RouteConfig([
	{ path: '/intro', name: 'WizardBasicInfoIntroComponent', component: WizardBasicInfoIntroComponent, useAsDefault: true },
	{ path: '/overview', name: 'WizardBasicInfoOverviewComponent', component: WizardBasicInfoOverviewComponent },
    { path: '/payments-policies', name: 'WizardBasicInfoPaymentsAndPoliciesComponent', component: WizardBasicInfoPaymentsAndPoliciesComponent },
    { path: '/property-details', name: 'WizardBasicInfoPropertyDetailsComponent', component: WizardBasicInfoPropertyDetailsComponent }
])
@Component({
	selector: 'wizard-basic-information',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/main/template/wizard-basic-information.html',
	directives: [RouterOutlet]
})
export class WizardBasicInformationComponent extends BaseComponent {
	constructor(wizardService: WizardService, basicInfoStateService: WizardBasicInformationStateService) {
		super();
		wizardService.bootstrapWizardIndex(basicInfoStateService.stateIndex);
	}
}