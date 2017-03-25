import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedPipesModule } from "../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule";
import { DynamicPriceModalComponent } from "./DynamicPriceModalComponent";

@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule],
    declarations: [DynamicPriceModalComponent],
    exports: [DynamicPriceModalComponent]
})
export class DynamicPriceModalModule { }
