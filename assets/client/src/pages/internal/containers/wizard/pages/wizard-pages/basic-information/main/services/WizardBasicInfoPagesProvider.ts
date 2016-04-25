import {WizardBasicInfoIntroService} from '../../pages/intro/services/WizardBasicInfoIntroService';
import {WizardBasicInfoOverviewService} from '../../pages/overview/services/WizardBasicInfoOverviewService';
import {WizardBasicInfoPaymentsAndPoliciesService} from '../../pages/payments-policies/services/WizardBasicInfoPaymentsAndPoliciesService';
import {WizardBasicInfoPropertyDetailsService} from '../../pages/property-details/services/WizardBasicInfoPropertyDetailsService';
import {WizardBasicInformationStateService} from './WizardBasicInformationStateService';

export const WIZARD_BASIC_INFO_PAGES_PROVIDERS: any[] = [
	WizardBasicInfoIntroService,
	WizardBasicInfoOverviewService,
	WizardBasicInfoPaymentsAndPoliciesService,
	WizardBasicInfoPropertyDetailsService,
    
    WizardBasicInformationStateService
];