import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {InvoicePayerComponent} from '../invoice-payer/InvoicePayerComponent';
import {ThButtonComponent} from '../../../../../../../../../../../../../common/utils/components/ThButtonComponent';

@Component({
    selector: 'invoice-edit',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-edit/template/invoice-edit.html',
    directives: [InvoicePayerComponent, ThButtonComponent],
    pipes: [TranslationPipe]
})
export class InvoiceEditComponent {

    public addInvoicePayer() {
        console.log('add invoice payer');
    }
}