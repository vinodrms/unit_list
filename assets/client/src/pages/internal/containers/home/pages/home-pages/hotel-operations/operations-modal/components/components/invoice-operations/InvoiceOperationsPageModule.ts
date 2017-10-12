import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {InvoiceOperationsPageComponent} from './InvoiceOperationsPageComponent';
import { InvoiceOverviewComponent } from './components/invoice-overview/InvoiceOverviewComponent';
import { RelatedInvoicesComponent } from "./components/related-invoices/RelatedInvoicesComponent";
import { InvoiceTransferComponent } from "./components/invoice-transfer/InvoiceTransferComponent";

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [InvoiceOperationsPageComponent, InvoiceOverviewComponent, RelatedInvoicesComponent, InvoiceTransferComponent ],
    exports: [InvoiceOperationsPageComponent]
})
export class InvoiceOperationsPageModule { }