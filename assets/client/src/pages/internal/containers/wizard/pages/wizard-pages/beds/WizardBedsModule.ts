import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonBedsModule} from '../../../../common/inventory/beds/CommonBedsModule';

import {wizardBedsRouting} from './WizardBedsRoutes';
import {WizardBedsComponent} from './WizardBedsComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonBedsModule, wizardBedsRouting],
    declarations: [WizardBedsComponent],
    exports: [WizardBedsComponent]
})
export class WizardBedsModule { }