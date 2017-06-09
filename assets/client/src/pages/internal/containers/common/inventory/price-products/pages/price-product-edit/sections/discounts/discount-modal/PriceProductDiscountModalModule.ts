import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedPipesModule } from '../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import { SharedComponentsModule } from '../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import { PriceProductConstraintSelectorModule } from "../../constraints/constraint-selector/PriceProductConstraintSelectorModule";
import { PriceProductDiscountModalComponent } from './PriceProductDiscountModalComponent';
import { CustomerSelectorModule } from "../../../../../../customer-register/utils/CustomerSelectorModule";

@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule, SharedComponentsModule, PriceProductConstraintSelectorModule, CustomerSelectorModule],
    declarations: [PriceProductDiscountModalComponent],
    exports: [PriceProductDiscountModalComponent],
})
export class PriceProductDiscountModalModule { }