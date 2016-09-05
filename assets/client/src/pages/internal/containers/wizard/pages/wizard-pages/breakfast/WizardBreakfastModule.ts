import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonAddOnProductsModule} from '../../../../common/inventory/add-on-products/CommonAddOnProductsModule';

import {wizardBreakfastRouting} from './WizardBreakfastRoutes';
import {WizardBreakfastComponent} from './WizardBreakfastComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonAddOnProductsModule, wizardBreakfastRouting],
    declarations: [WizardBreakfastComponent],
    exports: [WizardBreakfastComponent]
})
export class WizardBreakfastModule { }