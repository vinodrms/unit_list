import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedPipesModule } from '../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import { SharedDirectivesModule } from '../../../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import { SharedComponentsModule } from '../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import { CommonCustRegisterModule } from '../../../../../../../../common/inventory/customer-register/CommonCustRegisterModule';
import { EmailSelectorModule } from '../../../../../../home-pages/hotel-operations/email-sender/components/email-selector/EmailSelectorModule';

import { ExistingBookingSearchComponent } from './components/ExistingBookingSearchComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [ExistingBookingSearchComponent],
    exports: [ExistingBookingSearchComponent],
})
export class ExistingBookingSearchModule { }