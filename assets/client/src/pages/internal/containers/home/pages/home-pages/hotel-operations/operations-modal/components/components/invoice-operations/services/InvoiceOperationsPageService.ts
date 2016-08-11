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

@Injectable()
export class InvoiceOperationsPageService {

    constructor(private _appContext: AppContext,
        private _eagerInvoiceGroupsService: EagerInvoiceGroupsService,
        private _invoiceGroupsService: InvoiceGroupsService,
        private _hotelAggregatorService: HotelAggregatorService,
        private _eagerCustomersService: EagerCustomersService) {
    }

    public getPageData(pageParam: HotelInvoiceOperationsPageParam): Observable<InvoiceOperationsPageData> {
        return Observable.combineLatest(
            // this._eagerInvoiceGroupsService.getInvoiceGroup(pageParam.invoiceGroupId),
            this._eagerInvoiceGroupsService.getInvoiceGroup('57a4be2f3b5367b4324d667e'),
            this._hotelAggregatorService.getHotelAggregatedInfo()
        ).flatMap((result: [InvoiceGroupDO, HotelAggregatedInfo]) => {
            var pageData = new InvoiceOperationsPageData();
            pageData.invoiceGroupDO = result[0];
            pageData.ccy = result[1].ccy;
            pageData.allowedPaymentMethods = result[1].allowedPaymentMethods;
            pageData.allPaymentMethods = result[1].paymentMethods;
            return  Observable.combineLatest(
                Observable.from([pageData]),
                this._eagerCustomersService.getCustomersById(pageData.invoiceGroupDO.indexedCustomerIdList)
            );
        }).map((result: [InvoiceOperationsPageData, CustomersDO]) => {
            var pageData = result[0];
            pageData.customersContainer = result[1];
            return pageData;
        });
    }
}