import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonBasicInfoModule} from '../../../../../../common/basic-info/CommonBasicInfoModule';
import {settingsBasicInfoRouting} from './SettingsBasicInformationRoutes';

import {SettingsBasicInformationComponent} from './main/SettingsBasicInformationComponent';
import {SettingsBasicInfoOverviewComponent} from './pages/overview/SettingsBasicInfoOverviewComponent';
import {SettingsBasicInfoPaymentsAndPoliciesComponent} from './pages/payments-policies/SettingsBasicInfoPaymentsAndPoliciesComponent';
import {SettingsBasicInfoPropertyDetailsComponent} from './pages/property-details/SettingsBasicInfoPropertyDetailsComponent';

import {TimezoneService} from '../../../../../../../services/timezones/TimezoneService';

var settingsBasicInfoComponents = [
    SettingsBasicInformationComponent,
    SettingsBasicInfoOverviewComponent,
    SettingsBasicInfoPaymentsAndPoliciesComponent,
    SettingsBasicInfoPropertyDetailsComponent
];
@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonBasicInfoModule, settingsBasicInfoRouting],
    declarations: [settingsBasicInfoComponents],
    providers: [TimezoneService]
})
export class SettingsBasicInformationModule { }