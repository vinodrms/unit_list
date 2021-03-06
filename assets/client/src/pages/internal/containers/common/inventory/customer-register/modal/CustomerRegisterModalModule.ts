import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedPipesModule } from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import { SharedDirectivesModule } from '../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import { SharedComponentsModule } from '../../../../../../../common/utils/components/modules/SharedComponentsModule';
import { CommonCustRegisterModule } from '../CommonCustRegisterModule';

import { CustomerRegisterModalComponent } from './CustomerRegisterModalComponent';

@NgModule({
    imports: [CommonModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule,
        CommonCustRegisterModule],
    declarations: [CustomerRegisterModalComponent],
    exports: [CustomerRegisterModalComponent],
})
export class CustomerRegisterModalModule { }