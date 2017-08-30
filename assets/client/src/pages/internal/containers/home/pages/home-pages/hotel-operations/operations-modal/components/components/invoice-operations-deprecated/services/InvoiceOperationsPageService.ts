import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { ThError, AppContext } from '../../../../../../../../../../../../common/utils/AppContext';
import { InvoiceGroupsService } from '../../../../../../../../../../services/invoices/InvoiceGroupsService';
import { EagerInvoiceGroupsService } from '../../../../../../../../../../services/invoices/EagerInvoiceGroupsService';
import { EagerCustomersService } from '../../../../../../../../../../services/customers/EagerCustomersService';
import { HotelAggregatorService } from '../../../../../../../../../../services/hotel/HotelAggregatorService';
import { HotelInvoiceOperationsDeprecatedPageParam } from '../utils/HotelInvoiceOperationsDeprecatedPageParam';
import { InvoiceGroupDO } from '../../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO';
import { InvoiceOperationsPageData } from './utils/InvoiceOperationsPageData';
import { HotelAggregatedInfo } from '../../../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import { CustomersDO } from '../../../../../../../../../../services/customers/data-objects/CustomersDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import { InvoicePayerDO } from '../../../../../../../../../../services/invoices/data-objects/payers/InvoicePayerDO';
import { InvoicePaymentMethodDO } from '../../../../../../../../../../services/invoices/data-objects/payers/InvoicePaymentMethodDO';
import { EagerBookingsService } from '../../../../../../../../../../services/bookings/EagerBookingsService';
import { BookingsDO } from '../../../../../../../../../../services/bookings/data-objects/BookingsDO';

import * as _ from "underscore";

@Injectable()
export class InvoiceOperationsPageService {
    private _pageData: InvoiceOperationsPageData;

    constructor(private _appContext: AppContext,
        private _eagerInvoiceGroupsService: EagerInvoiceGroupsService,
        private _invoiceGroupsService: InvoiceGroupsService,
        private _hotelAggregatorService: HotelAggregatorService,
        private _eagerCustomersService: EagerCustomersService,
        private _eagerBookingService: EagerBookingsService) {
        this._pageData = new InvoiceOperationsPageData();
    }

    public getPageData(pageParam: HotelInvoiceOperationsDeprecatedPageParam): Observable<InvoiceOperationsPageData> {
        return Observable.combineLatest(
            this.getInvoiceGroupDO(pageParam.invoiceGroupId),
            this._hotelAggregatorService.getHotelAggregatedInfo()
        ).flatMap((result: [InvoiceGroupDO, HotelAggregatedInfo]) => {
            this._pageData.ccy = result[1].ccy;
            this._pageData.allowedPaymentMethods = result[1].allowedPaymentMethods;
            this._pageData.allPaymentMethods = result[1].allAvailablePaymentMethods;
            this._pageData.invoiceGroupDO = result[0];

            if (this._appContext.thUtils.isUndefinedOrNull(this._pageData.invoiceGroupDO.invoiceList) || _.isEmpty(this._pageData.invoiceGroupDO.invoiceList)) {
                this._pageData.invoiceGroupDO.invoiceList = [];

                var customerId = pageParam.invoiceFilter.customerId;
                var invoiceDOWithDefaultPayer = this.getInvoiceDOWithDefaultPayer(customerId);
                this._pageData.invoiceGroupDO.invoiceList.push(invoiceDOWithDefaultPayer);
                this._pageData.invoiceGroupDO.indexedCustomerIdList = [];
                this._pageData.invoiceGroupDO.indexedCustomerIdList.push(customerId);
            }

            return Observable.combineLatest(
                Observable.from([this._pageData]),
                this._eagerCustomersService.getCustomersById(this._pageData.invoiceGroupDO.indexedCustomerIdList),
                this.getBookingsDO(this._pageData.invoiceGroupDO.groupBookingId)
            );

        }).map((result: [InvoiceOperationsPageData, CustomersDO, BookingsDO]) => {
            var pageData = result[0];
            pageData.customersContainer = result[1];
            pageData.bookingsContainer = result[2];
            return pageData;
        });

    }
    
    private getBookingsDO(groupBookingId?: string): Observable<BookingsDO> {
        if(!this._appContext.thUtils.isUndefinedOrNull(groupBookingId)) {
            return this._eagerBookingService.getBookingsByGroupBookingId(groupBookingId);
        }
        else {
            var bookingsDO = new BookingsDO();
            return Observable.from([bookingsDO]);
        }
    }

    private getInvoiceGroupDO(invoiceGroupId: string): Observable<InvoiceGroupDO> {
        if (!this._appContext.thUtils.isUndefinedOrNull(invoiceGroupId)) {
            return this._eagerInvoiceGroupsService.getInvoiceGroup(invoiceGroupId);
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