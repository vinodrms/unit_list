import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {ROUTER_DIRECTIVES} from '@angular/router';
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

@Component({
	selector: 'wizard-basic-information',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/main/template/wizard-basic-information.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [TimezoneService],
	precompile: [WizardBasicInfoIntroComponent, WizardBasicInfoOverviewComponent, WizardBasicInfoPaymentsAndPoliciesComponent, WizardBasicInfoPropertyDetailsComponent]
})
export class WizardBasicInformationComponent extends BaseComponent {
	constructor(wizardService: WizardService, basicInfoStateService: WizardBasicInformationStateService) {
		super();
		wizardService.bootstrapWizardIndex(basicInfoStateService.stateIndex);
	}
}