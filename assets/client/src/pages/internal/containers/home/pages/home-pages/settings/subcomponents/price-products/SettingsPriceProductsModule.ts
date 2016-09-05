import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonPriceProductsModule} from '../../../../../../common/inventory/price-products/CommonPriceProductsModule';

import {settingsPriceProductsRouting} from './SettingsPriceProductsRoutes';
import {SettingsPriceProductsComponent} from './SettingsPriceProductsComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonPriceProductsModule, settingsPriceProductsRouting],
    declarations: [SettingsPriceProductsComponent],
    exports: [SettingsPriceProductsComponent],
})
export class SettingsPriceProductsModule { }