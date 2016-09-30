import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedPipesModule } from '../../../../../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import { SharedDirectivesModule } from '../../../../../../../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import { SharedComponentsModule } from '../../../../../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import { ExistingBookingSearchModule } from '../../../../../../../../../../utils/new-booking/component/subcomponents/booking-search/modules/ExistingBookingSearchModule';

import { ChangePriceProductModalComponent } from './ChangePriceProductModalComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule, ExistingBookingSearchModule],
    declarations: [ChangePriceProductModalComponent],
    exports: [ChangePriceProductModalComponent]
})
export class ChangePriceProductModalModule { }