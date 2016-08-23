import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {ThError, AppContext} from '../../../../../../../../../../../../common/utils/AppContext';
import {InvoiceGroupsService} from '../../../../../../../../../../services/invoices/InvoiceGroupsService';
import {EagerInvoiceGroupsService} from '../../../../../../../../../../services/invoices/EagerInvoiceGroupsService';
import {EagerCustomersService} from '../../../../../../../../../../services/customers/EagerCustomersService';
import {HotelAggregatorService} from '../../../../../../../../../../services/hotel/HotelAggregatorService';
import {HotelInvoiceOperationsPageParam} from '../utils/HotelInvoiceOperationsPageParam';
import {InvoiceGroupDO} from '../../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO';
import {InvoiceOperationsPageData} from './utils/InvoiceOperationsPageData';
import {HotelAggregatedInfo} from '../../../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import {CustomersDO} from '../../../../../../../../../../services/customers/data-objects/CustomersDO';
import {InvoiceDO, InvoicePaymentStatus} from '../../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import {InvoicePayerDO} from '../../../../../../../../../../services/invoices/data-objects/payers/InvoicePayerDO';
import {InvoicePaymentMethodDO} from '../../../../../../../../../../services/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {EagerBookingsService} from '../../../../../../../../../../services/bookings/EagerBookingsService';

@Injectable()
export class InvoiceOperationsPageService {
    private _pageData: InvoiceOperationsPageData;

    constructor(private _appContext: AppContext,
        private _eagerInvoiceGroupsService: EagerInvoiceGroupsService,
        private _invoiceGroupsService: InvoiceGroupsService,
        private _hotelAggregatorService: HotelAggregatorService,
        private _eagerCustomersService: EagerCustomersService) {
        this._pageData = new InvoiceOperationsPageData();
    }

    public getPageData(pageParam: HotelInvoiceOperationsPageParam): Observable<InvoiceOperationsPageData> {
        return Observable.combineLatest(
            this.getInvoiceGroupDO(pageParam.invoiceGroupId, pageParam.invoiceFilter.customerId),
            this._hotelAggregatorService.getHotelAggregatedInfo()
        ).flatMap((result: [InvoiceGroupDO, HotelAggregatedInfo]) => {
            this._pageData.ccy = result[1].ccy;
            this._pageData.allowedPaymentMethods = result[1].allowedPaymentMethods;
            this._pageData.allPaymentMethods = result[1].paymentMethods;
            this._pageData.invoiceGroupDO = result[0];

            if (this._appContext.thUtils.isUndefinedOrNull(this._pageData.invoiceGroupDO.invoiceList) || _.isEmpty(this._pageData.invoiceGroupDO.invoiceList)) {
                this._pageData.invoiceGroupDO.invoiceList = [];
                this._pageData.invoiceGroupDO.invoiceList.push(this.getInvoiceDOWithDefaultPayer(pageParam.invoiceFilter.customerId));
            }

            return Observable.combineLatest(
                Observable.from([this._pageData]),
                this._eagerCustomersService.getCustomersById(this._pageData.invoiceGroupDO.indexedCustomerIdList)
            );

        }).map((result: [InvoiceOperationsPageData, CustomersDO]) => {
            var pageData = result[0];
            pageData.customersContainer = result[1];
            return pageData;
        });

    }

    private getInvoiceGroupDO(invoiceGroupId: string, customerId: string): Observable<InvoiceGroupDO> {
        if (!this._appContext.thUtils.isUndefinedOrNull(invoiceGroupId)) {
            return this._eagerInvoiceGroupsService.getInvoiceGroup(invoiceGroupId)
        }
        var invoiceGroupDO = new InvoiceGroupDO();
        return Observable.from([invoiceGroupDO]);
    }

    private getInvoiceDOWithDefaultPayer(customerId: string): InvoiceDO {
        var invoiceDO = new InvoiceDO();
        invoiceDO.buildCleanInvoice();
        invoiceDO.payerList[0].customerId = customerId;
        invoiceDO.payerList[0].priceToPay = 0;
        invoiceDO.payerList[0].paymentMethod = this._pageData.allowedPaymentMethods[0];
        return invoiceDO;
    }
}