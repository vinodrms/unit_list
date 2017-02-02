import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {settingsReportsRouting} from './SettingsReportsRoutes';

import {SharedComponentsModule} from '../../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {SettingsReportsComponent} from './main/SettingsReportsComponent';
import {SettingsShiftReportComponent} from './pages/shift-report/SettingsShiftReportComponent';
import {SettingsBackUpReportComponent} from './pages/backup-report/SettingsBackUpReportComponent';
import {SettingsKeyMetricsReportComponent} from './pages/key-metrics-report/SettingsKeyMetricsReportComponent';

import {TimezoneService} from '../../../../../../../services/timezones/TimezoneService';

var settingsReportsComponents = [
    SettingsReportsComponent,
    SettingsShiftReportComponent,
    SettingsBackUpReportComponent,
    SettingsKeyMetricsReportComponent
];
@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule, SharedComponentsModule, settingsReportsRouting],
    declarations: [settingsReportsComponents],
    providers: [TimezoneService]
})
export class SettingsReportsModule { }