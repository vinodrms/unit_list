import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';
import {WizardBasicInfoIntroComponent} from '../pages/intro/WizardBasicInfoIntroComponent';
import {WizardBasicInfoOverviewComponent} from '../pages/overview/WizardBasicInfoOverviewComponent';
import {WizardBasicInfoPaymentsAndPoliciesComponent} from '../pages/payments-policies/WizardBasicInfoPaymentsAndPoliciesComponent';
import {WizardBasicInfoPropertyDetailsComponent} from '../pages/property-details/WizardBasicInfoPropertyDetailsComponent';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../../../../../services/hotel/HotelProviders';
import {SETTINGS_PROVIDERS} from '../../../../../../services/settings/SettingsProviders';
import {TimezoneService} from '../../../../../../services/timezones/TimezoneService';
import {WizardBasicInformationStateService} from './services/WizardBasicInformationStateService';
import {WizardService} from '../../services/WizardService';

//TODO: change this code to use Decorator
import {WizardStepsComponent} from '../../../utils/wizard-steps/WizardStepsComponent';

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
	providers: [TimezoneService]
})
export class WizardBasicInformationComponent extends BaseComponent {
	constructor(wizardService: WizardService, basicInfoStateService: WizardBasicInformationStateService) {
		super();
		wizardService.bootstrapWizardIndex(basicInfoStateService.stateIndex);
	}
}