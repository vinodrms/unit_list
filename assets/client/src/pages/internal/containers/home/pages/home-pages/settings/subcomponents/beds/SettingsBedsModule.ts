import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonBedsModule} from '../../../../../../common/inventory/beds/CommonBedsModule';

import {settingsBedsRouting} from './SettingsBedsRoutes';
import {SettingsBedsComponent} from './SettingsBedsComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonBedsModule, settingsBedsRouting],
    declarations: [SettingsBedsComponent],
    exports: [SettingsBedsComponent]
})
export class SettingsBedsModule { }