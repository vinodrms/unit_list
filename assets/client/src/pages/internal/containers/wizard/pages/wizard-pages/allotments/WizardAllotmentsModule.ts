import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonAllotmentsModule} from '../../../../common/inventory/allotments/CommonAllotmentsModule';

import {wizardAllotmentsRouting} from './WizardAllotmentsRoutes';
import {WizardAllotmentsComponent} from './WizardAllotmentsComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonAllotmentsModule, wizardAllotmentsRouting],
    declarations: [WizardAllotmentsComponent],
    exports: [WizardAllotmentsComponent],
})
export class WizardAllotmentsModule { }