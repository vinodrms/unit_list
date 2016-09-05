import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import {CustomerPreviewModule} from '../../../../../../../../common/inventory/customer-register/pages/customer-preview/CustomerPreviewModule';

import {CustomerOperationsPageComponent} from './CustomerOperationsPageComponent';
import {CustomerDetailsEditorComponent} from './components/customer-details/CustomerDetailsEditorComponent';
import {CustomerBookingHistoryComponent} from './components/booking-history/CustomerBookingHistoryComponent';
import {CustomerInvoiceHistoryComponent} from './components/invoice-history/CustomerInvoiceHistoryComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule, CustomerPreviewModule],
    declarations: [CustomerOperationsPageComponent,
        CustomerDetailsEditorComponent, CustomerBookingHistoryComponent, CustomerInvoiceHistoryComponent],
    exports: [CustomerOperationsPageComponent]
})
export class CustomerOperationsPageModule { }