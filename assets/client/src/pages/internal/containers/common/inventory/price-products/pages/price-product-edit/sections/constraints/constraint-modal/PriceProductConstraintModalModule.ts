import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';

import {PriceProductConstraintModalComponent} from './PriceProductConstraintModalComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule],
    declarations: [PriceProductConstraintModalComponent],
    exports: [PriceProductConstraintModalComponent],
})
export class PriceProductConstraintModalModule { }