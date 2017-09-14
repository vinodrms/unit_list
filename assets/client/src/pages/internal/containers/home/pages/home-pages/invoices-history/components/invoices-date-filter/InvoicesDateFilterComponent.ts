import {Component} from '@angular/core';
import {ThDateIntervalPickerComponent} from '../../../../../../../../../common/utils/components/ThDateIntervalPickerComponent';
import {InvoiceService} from '../../../../../../../services/invoices/InvoiceService';
import {ThDateIntervalDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';

@Component({
    selector: 'invoices-date-filter',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/invoices-history/components/invoices-date-filter/template/invoices-date-filter.html'
})
export class InvoicesDateFilterComponent {
    searchInterval: ThDateIntervalDO;
    private _filterByPaidDateInterval: boolean;

    constructor(private _invoiceService: InvoiceService) {
        this.searchInterval = this._invoiceService.paidInterval;
        this.filterByPaidDateInterval = false;
    }

    public didSelectSearchInterval(interval: ThDateIntervalDO) {
        this._invoiceService.paidInterval = interval;
    }

    public get filterByPaidDateInterval(): boolean {
        return this._filterByPaidDateInterval;
    }
    public set filterByPaidDateInterval(value: boolean) {
        this._filterByPaidDateInterval = value;
        this._invoiceService.filterByPaidDateInterval = value;
    }
}