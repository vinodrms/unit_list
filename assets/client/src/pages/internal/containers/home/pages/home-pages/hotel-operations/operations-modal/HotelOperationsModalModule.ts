import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import {HotelOperationsModule} from './components/HotelOperationsModule';

import {HotelOperationsModalComponent} from './HotelOperationsModalComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule,
        HotelOperationsModule],
    declarations: [HotelOperationsModalComponent],
    exports: [HotelOperationsModalComponent]
})
export class HotelOperationsModalModule { }