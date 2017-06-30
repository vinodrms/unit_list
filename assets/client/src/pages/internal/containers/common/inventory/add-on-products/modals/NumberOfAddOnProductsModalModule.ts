import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import { SharedDirectivesModule } from "../../../../../../../common/utils/directives/modules/SharedDirectivesModule";
import { SharedPipesModule } from "../../../../../../../common/utils/pipes/modules/SharedPipesModule";
import { SharedComponentsModule } from "../../../../../../../common/utils/components/modules/SharedComponentsModule";
import { NumberOfAddOnProductsModalComponent } from './NumberOfAddOnProductsModalComponent';


@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [NumberOfAddOnProductsModalComponent],
    exports: [NumberOfAddOnProductsModalComponent]
})
export class NumberOfAddOnProductsModalModule { }