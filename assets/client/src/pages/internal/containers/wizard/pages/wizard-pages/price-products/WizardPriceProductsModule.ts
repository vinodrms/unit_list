import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonPriceProductsModule} from '../../../../common/inventory/price-products/CommonPriceProductsModule';

import {wizardPriceProductsRouting} from './WizardPriceProductsRoutes';
import {WizardPriceProductsComponent} from './WizardPriceProductsComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonPriceProductsModule, wizardPriceProductsRouting],
    declarations: [WizardPriceProductsComponent],
    exports: [WizardPriceProductsComponent],
})
export class WizardPriceProductsModule { }