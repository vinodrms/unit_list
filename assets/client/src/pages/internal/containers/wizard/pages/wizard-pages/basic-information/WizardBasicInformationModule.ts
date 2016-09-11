import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../common/utils/components/modules/SharedComponentsModule';
import {CommonBasicInfoModule} from '../../../../common/basic-info/CommonBasicInfoModule';
import {WizardStepsModule} from '../../utils/wizard-steps/WizardStepsModule';
import {wizardBasicInfoRouting} from './WizardBasicInformationRoutes';
import {WizardBasicInformationComponent} from './main/WizardBasicInformationComponent';
import {WizardBasicInfoIntroComponent} from './pages/intro/WizardBasicInfoIntroComponent';
import {WizardBasicInfoOverviewComponent} from './pages/overview/WizardBasicInfoOverviewComponent';
import {WizardBasicInfoPaymentsAndPoliciesComponent} from './pages/payments-policies/WizardBasicInfoPaymentsAndPoliciesComponent';
import {WizardBasicInfoPropertyDetailsComponent} from './pages/property-details/WizardBasicInfoPropertyDetailsComponent';

import {TimezoneService} from '../../../../../services/timezones/TimezoneService';

var wizardBasicInfoComponents = [
    WizardBasicInformationComponent,
    WizardBasicInfoIntroComponent,
    WizardBasicInfoOverviewComponent,
    WizardBasicInfoPaymentsAndPoliciesComponent,
    WizardBasicInfoPropertyDetailsComponent
];
@NgModule({
    imports: [CommonModule, SharedPipesModule, SharedDirectivesModule, SharedComponentsModule,
        CommonBasicInfoModule, WizardStepsModule, wizardBasicInfoRouting],
    declarations: [wizardBasicInfoComponents],
    exports: [wizardBasicInfoComponents],
    providers: [TimezoneService]
})
export class WizardBasicInformationModule { }