import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonAddOnProductsModule} from '../../../../common/inventory/add-on-products/CommonAddOnProductsModule';

import {wizardAddOnProductsRouting} from './WizardAddOnProductsRoutes';
import {WizardAddOnProductsComponent} from './WizardAddOnProductsComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonAddOnProductsModule, wizardAddOnProductsRouting],
    declarations: [WizardAddOnProductsComponent],
    exports: [WizardAddOnProductsComponent],
})
export class WizardAddOnProductsModule { }