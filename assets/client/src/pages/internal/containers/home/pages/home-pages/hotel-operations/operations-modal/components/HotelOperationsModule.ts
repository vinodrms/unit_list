import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import {RoomOperationsPageModule} from './components/room-operations/RoomOperationsPageModule';
import {BookingOperationsPageModule} from './components/booking-operations/BookingOperationsPageModule';
import {CustomerOperationsPageModule} from './components/customer-operations/CustomerOperationsPageModule';
import {InvoiceOperationsPageDeprecatedModule} from './components/invoice-operations-deprecated/InvoiceOperationsPageDeprecatedModule';
import {InvoiceOperationsPageModule} from './components/invoice-operations/InvoiceOperationsPageModule';

import {HotelOperationsComponent} from './HotelOperationsComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule,
        RoomOperationsPageModule, BookingOperationsPageModule,
        CustomerOperationsPageModule, InvoiceOperationsPageModule, InvoiceOperationsPageDeprecatedModule],
    declarations: [HotelOperationsComponent],
    exports: [HotelOperationsComponent]
})
export class HotelOperationsModule { }