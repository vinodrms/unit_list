import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedComponentsModule} from '../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import {SharedPipesModule} from "../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule";
import {CopyPriceProductValuesModalComponent} from "./CopyPriceProductValuesModalComponent";


@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule, SharedComponentsModule],
    declarations: [CopyPriceProductValuesModalComponent],
    exports: [CopyPriceProductValuesModalComponent]
})
export class CopyPriceProductValuesModalModule { }
