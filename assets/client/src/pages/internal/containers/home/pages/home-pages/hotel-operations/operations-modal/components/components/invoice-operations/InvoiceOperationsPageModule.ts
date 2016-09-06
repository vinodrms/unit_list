import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {InvoiceOperationsPageComponent} from './InvoiceOperationsPageComponent';
import {InvoiceEditComponent} from './components/invoice-edit/InvoiceEditComponent';
import {InvoicePayerComponent} from './components/invoice-payer/InvoicePayerComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [InvoiceOperationsPageComponent, InvoiceEditComponent, InvoicePayerComponent],
    exports: [InvoiceOperationsPageComponent]
})
export class InvoiceOperationsPageModule { }