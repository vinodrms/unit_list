import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {BookingOperationsPageComponent} from './BookingOperationsPageComponent';
import {BookingPeriodEditorComponent} from './components/period-editor/BookingPeriodEditorComponent';
import {BookingNoShowEditorComponent} from './components/no-show-edit/BookingNoShowEditorComponent';
import {BookingRoomEditorComponent} from './components/room-edit/BookingRoomEditorComponent';
import {BookingCapacityEditorComponent} from './components/capacity-edit/BookingCapacityEditorComponent';
import {BookingPaymentGuaranteeEditorComponent} from './components/payment-guarantee-edit/BookingPaymentGuaranteeEditorComponent';
import {BookingDetailsEditorComponent} from './components/booking-details/BookingDetailsEditorComponent';
import {BookingPriceProductEditorComponent} from './components/price-product-view/BookingPriceProductEditorComponent';
import {BookingAllotmentViewerComponent} from './components/allotment-view/BookingAllotmentViewerComponent';
import {BookingCustomerEditorComponent} from './components/customers-edit/BookingCustomerEditorComponent';
import {BookingReactivateComponent} from './components/reactivate/BookingReactivateComponent';
import {BookingCancelComponent} from './components/cancel/BookingCancelComponent';
import {BookingSendConfirmationComponent} from './components/send-confirmation/BookingSendConfirmationComponent';
import {BookingLinksComponent} from './components/booking-links/BookingLinksComponent';
import {BookingReserveAddOnProductEditorComponent} from './components/reserve-add-on-product/BookingReserveAddOnProductEditorComponent';
import {BookingUndoCheckInComponent} from './components/undo-check-in/BookingUndoCheckInComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [BookingOperationsPageComponent,
        BookingPeriodEditorComponent, BookingNoShowEditorComponent, BookingRoomEditorComponent,
        BookingCapacityEditorComponent, BookingPaymentGuaranteeEditorComponent, BookingDetailsEditorComponent,
        BookingPriceProductEditorComponent, BookingAllotmentViewerComponent,
        BookingCustomerEditorComponent, BookingReactivateComponent, BookingCancelComponent,
        BookingSendConfirmationComponent, BookingLinksComponent, BookingReserveAddOnProductEditorComponent,
        BookingUndoCheckInComponent],
    exports: [BookingOperationsPageComponent]
})
export class BookingOperationsPageModule { }