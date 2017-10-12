import _ = require('underscore');
import { InvoicesDO } from "../../data-objects/InvoicesDO";
import { Observable } from "rxjs/Observable";
import { InvoiceVM } from "../InvoiceVM";
import { CustomersDO } from "../../../customers/data-objects/CustomersDO";
import { InvoiceDO } from "../../data-objects/InvoiceDO";
import { InvoicePayerDO } from "../../data-objects/payer/InvoicePayerDO";
import { AppContext } from "../../../../../../common/utils/AppContext";
import { EagerCustomersService } from "../../../customers/EagerCustomersService";
import { Injectable } from "@angular/core";
import { InvoiceMetaFactory } from "../../data-objects/InvoiceMetaFactory";
import { EagerRoomsService } from '../../../rooms/EagerRoomsService';
import { RoomsDO } from '../../../rooms/data-objects/RoomsDO';

@Injectable()
export class InvoiceVMHelper {

    private invoiceMetaFactory: InvoiceMetaFactory;

    constructor(private context: AppContext,
        private eagerCustomersService: EagerCustomersService,
        private eagerRoomsService: EagerRoomsService,
    ) {
        this.invoiceMetaFactory = new InvoiceMetaFactory();
    }

    public convertToViewModels(invoices: InvoicesDO): Observable<InvoiceVM[]> {
        var customerIdList: string[] = invoices.getUniqueCustomerIdList();
        customerIdList = customerIdList.concat(invoices.getBookingCustomerIdList());
        customerIdList = _.uniq(customerIdList);

        var bookingRoomIdList: string[] = invoices.getBookingRoomIdList();

        return Observable.combineLatest(
            this.eagerCustomersService.getCustomersById(customerIdList),
            this.eagerRoomsService.getRoomsByIds(bookingRoomIdList),
        ).map((result: [CustomersDO, RoomsDO]) => {
            var customers: CustomersDO = result[0];
            var bookingRooms: RoomsDO = result[1];

            var invoiceVMList: InvoiceVM[] = [];
            _.forEach(invoices.invoiceList, (invoice: InvoiceDO) => {
                var invoiceVM = new InvoiceVM();

                // populate booking customers
                invoiceVM.bookingCustomerList = [];
                let bookingCustomerIdList = invoice.getBookingCustomerIdList();
                bookingCustomerIdList.forEach((bookingCustomerId: string) => {
                    let bookingCustomer = customers.getCustomerById(bookingCustomerId);
                    if (!this.context.thUtils.isUndefinedOrNull(bookingCustomer)) {
                        invoiceVM.bookingCustomerList.push(bookingCustomer);
                    }
                });

                // populate booking rooms
                invoiceVM.bookingRoomList = [];
                let bookingRoomIdList = invoice.getBookingRoomIdList();
                bookingRoomIdList.forEach((bookingRoomId: string) => {
                    let bookingRoom = bookingRooms.getRoomById(bookingRoomId);
                    if (!this.context.thUtils.isUndefinedOrNull(bookingRoom)) {
                        invoiceVM.bookingRoomList.push(bookingRoom);
                    }
                });

                // payers
                invoiceVM.customerList = [];
                _.forEach(invoice.payerList, (payer: InvoicePayerDO) => {
                    invoiceVM.customerList.push(customers.getCustomerById(payer.customerId));
                });

                invoiceVM.invoice = invoice;
                invoiceVM.invoiceMeta = this.invoiceMetaFactory.getInvoiceMeta(invoice.paymentStatus, invoice.accountingType);
                invoiceVMList.push(invoiceVM);
            });
            return invoiceVMList;
        });
    }
}
