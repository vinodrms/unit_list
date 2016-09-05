import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonAllotmentsModule} from '../../../../../../common/inventory/allotments/CommonAllotmentsModule';

import {settingsAllotmentsRouting} from './SettingsAllotmentsRoutes';
import {SettingsAllotmentsComponent} from './SettingsAllotmentsComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonAllotmentsModule, settingsAllotmentsRouting],
    declarations: [SettingsAllotmentsComponent],
    exports: [SettingsAllotmentsComponent],
})
export class SettingsAllotmentsModule { }