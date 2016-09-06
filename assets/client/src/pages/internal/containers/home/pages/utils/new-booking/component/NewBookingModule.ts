import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import {CommonCustRegisterModule} from '../../../../../common/inventory/customer-register/CommonCustRegisterModule';
import {EmailSelectorModule} from '../../../home-pages/hotel-operations/email-sender/components/email-selector/EmailSelectorModule';

import {NewBookingContainerComponent} from './container/NewBookingContainerComponent';
import {NewBookingSearchComponent} from './subcomponents/booking-search/NewBookingSearchComponent';
import {BookingSearchParametersComponent} from './subcomponents/booking-search/components/search-parameters/BookingSearchParametersComponent';
import {NewBookingFillDetailsComponent} from './subcomponents/booking-fill-details/NewBookingFillDetailsComponent';
import {NewBookingDetailsEditorComponent} from './subcomponents/booking-fill-details/components/NewBookingDetailsEditorComponent';
import {NewBookingCustomerRegisterComponent} from './subcomponents/booking-customer-register/NewBookingCustomerRegisterComponent';
import {NewBookingEmailConfigComponent} from './subcomponents/booking-email-config/NewBookingEmailConfigComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule,
        CommonCustRegisterModule, EmailSelectorModule],
    declarations: [NewBookingContainerComponent,
        NewBookingSearchComponent, BookingSearchParametersComponent,
        NewBookingFillDetailsComponent, NewBookingDetailsEditorComponent,
        NewBookingCustomerRegisterComponent, NewBookingEmailConfigComponent],
    exports: [NewBookingContainerComponent],
})
export class NewBookingModule { }