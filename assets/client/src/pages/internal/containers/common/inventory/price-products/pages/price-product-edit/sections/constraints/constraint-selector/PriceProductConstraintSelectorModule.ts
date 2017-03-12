import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PriceProductConstraintSelectorComponent } from './PriceProductConstraintSelectorComponent';
import { SharedPipesModule } from "../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule";

@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule],
    declarations: [PriceProductConstraintSelectorComponent],
    exports: [PriceProductConstraintSelectorComponent]
})
export class PriceProductConstraintSelectorModule { }
