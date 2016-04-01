import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {WizardBasicInfoIntroComponent} from '../pages/intro/WizardBasicInfoIntroComponent';
import {WizardBasicInfoOverviewComponent} from '../pages/overview/WizardBasicInfoOverviewComponent';
import {WizardBasicInfoPaymentsAndPoliciesComponent} from '../pages/payments-policies/WizardBasicInfoPaymentsAndPoliciesComponent';
import {WizardBasicInfoPropertyDetailsComponent} from '../pages/property-details/WizardBasicInfoPropertyDetailsComponent';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../../../../../services/hotel/HotelProviders';
import {SETTINGS_PROVIDERS} from '../../../../../../services/settings/SettingsProviders';
import {TaxService} from '../../../../../../services/taxes/TaxService';
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
	directives: [RouterOutlet],
	providers: [SETTINGS_PROVIDERS, HOTEL_AGGREGATOR_PROVIDERS, TaxService]
})
export class WizardBasicInformationComponent extends BaseComponent {
	constructor(wizardService: WizardService, basicInfoStateService: WizardBasicInformationStateService) {
		super();
		wizardService.bootstrapWizardIndex(basicInfoStateService.stateIndex);
	}
}