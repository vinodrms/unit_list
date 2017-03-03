import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedPipesModule } from '../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import { PriceEditModule } from '../price-edit/PriceEditModule';
import { PriceExceptionModalComponent } from './PriceExceptionModalComponent';

@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule, PriceEditModule],
    declarations: [PriceExceptionModalComponent],
    exports: [PriceExceptionModalComponent]
})
export class PriceExceptionModalModule { }
