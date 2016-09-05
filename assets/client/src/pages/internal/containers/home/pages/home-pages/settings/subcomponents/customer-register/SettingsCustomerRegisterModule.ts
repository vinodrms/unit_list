import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonCustRegisterModule} from '../../../../../../common/inventory/customer-register/CommonCustRegisterModule';

import {settingsCustomerRegisterRouting} from './SettingsCustomerRegisterRoutes';
import {SettingsCustomerRegisterComponent}    from './SettingsCustomerRegisterComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonCustRegisterModule, settingsCustomerRegisterRouting],
    declarations: [SettingsCustomerRegisterComponent],
    exports: [SettingsCustomerRegisterComponent],
})
export class SettingsCustomerRegisterModule { }