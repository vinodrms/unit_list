import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {AddOnProductsModalComponent} from './AddOnProductsModalComponent';

@NgModule({
    imports: [CommonModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [AddOnProductsModalComponent],
    exports: [AddOnProductsModalComponent],
})
export class AddOnProductsModalModule { }