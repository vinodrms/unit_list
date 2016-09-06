import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonCustRegisterModule} from '../../../../common/inventory/customer-register/CommonCustRegisterModule';

import {wizardCustomerRegisterRouting} from './WizardCustomerRegisterRoutes';
import {WizardCustomerRegisterComponent} from './WizardCustomerRegisterComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonCustRegisterModule, wizardCustomerRegisterRouting],
    declarations: [WizardCustomerRegisterComponent],
    exports: [WizardCustomerRegisterComponent],
})
export class WizardCustomerRegisterModule { }