import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonAddOnProductsModule} from '../../../../../../common/inventory/add-on-products/CommonAddOnProductsModule';

import {settingsBreakfastRouting} from './SettingsBreakfastRoutes';
import {SettingsBreakfastComponent} from './SettingsBreakfastComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonAddOnProductsModule, settingsBreakfastRouting],
    declarations: [SettingsBreakfastComponent],
    exports: [SettingsBreakfastComponent]
})
export class SettingsBreakfastModule { }