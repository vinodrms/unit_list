import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonAddOnProductsModule} from '../../../../../../common/inventory/add-on-products/CommonAddOnProductsModule';

import {settingsAddOnProductsRouting} from './SettinsAddOnProductsRoutes';
import {SettingsAddOnProductsComponent} from './SettingsAddOnProductsComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonAddOnProductsModule, settingsAddOnProductsRouting],
    declarations: [SettingsAddOnProductsComponent],
    exports: [SettingsAddOnProductsComponent],
})
export class SettingsAddOnProductsModule { }