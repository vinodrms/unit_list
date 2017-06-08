import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { SharedPipesModule } from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import { settingsReportsRouting } from './SettingsReportsRoutes';

import { SharedComponentsModule } from '../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import { SharedDirectivesModule } from '../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';

import { SettingsReportsComponent } from './main/SettingsReportsComponent';
import { ReportOutputFormatComponent } from './pages/common/report-output-format/ReportOutputFormatComponent';
import { SettingsShiftReportComponent } from './pages/shift-report/SettingsShiftReportComponent';
import { SettingsBackUpReportComponent } from './pages/backup-report/SettingsBackUpReportComponent';
import { SettingsKeyMetricsReportComponent } from './pages/key-metrics-report/SettingsKeyMetricsReportComponent';
import { SettingsHousekeepingReportComponent } from "./pages/housekeeping-report/SettingsHousekeepingReportComponent";
import { BookingsReportComponent } from "./pages/bookings-report/BookingsReportComponent";
import { InvoicesReportComponent } from "./pages/invoices-report/InvoicesReportComponent";

import { TimezoneService } from '../../../../../../../services/timezones/TimezoneService';


var settingsReportsComponents = [
    SettingsReportsComponent,
    ReportOutputFormatComponent,
    SettingsShiftReportComponent,
    SettingsBackUpReportComponent,
    SettingsKeyMetricsReportComponent,
    SettingsHousekeepingReportComponent,
    BookingsReportComponent,
    InvoicesReportComponent,
    
];
@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule, SharedComponentsModule, SharedDirectivesModule, settingsReportsRouting],
    declarations: [settingsReportsComponents],
    providers: [TimezoneService]
})
export class SettingsReportsModule { }