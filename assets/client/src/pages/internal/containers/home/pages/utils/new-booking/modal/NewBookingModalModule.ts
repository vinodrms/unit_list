import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import {NewBookingModule} from '../component/NewBookingModule';

import {NewBookingModalComponent} from './NewBookingModalComponent';

@NgModule({
    imports: [CommonModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule,
        NewBookingModule],
    declarations: [NewBookingModalComponent],
    exports: [NewBookingModalComponent],
})
export class NewBookingModalModule { }