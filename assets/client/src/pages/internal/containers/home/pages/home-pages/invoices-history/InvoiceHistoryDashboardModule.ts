import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {InvoiceHistoryDashboardComponent} from './InvoiceHistoryDashboardComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [InvoiceHistoryDashboardComponent],
    exports: [InvoiceHistoryDashboardComponent]
})
export class InvoiceHistoryDashboardModule { }