import _ = require('underscore');
import { ThUtils } from "../../../utils/ThUtils";
import { GenerateBookingInvoiceDO, BookingInvoiceItem } from "./GenerateBookingInvoiceDO";
import { BookingDO, AddOnProductBookingReservedItem } from "../../../data-layer/bookings/data-objects/BookingDO";
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { InvoiceDO, InvoiceAccountingType } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { ValidationResultParser } from "../../common/ValidationResultParser";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../utils/logging/ThLogger";
import { AddOnProductLoader, AddOnProductItemContainer, AddOnProductItem } from "../../add-on-products/validators/AddOnProductLoader";
import { InvoiceSearchResultRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceRepository";
import { GenerateBookingInvoiceActionFactory } from "./utils/GenerateBookingInvoiceActionFactory";
import { IGenerateBookingInvoiceActionStrategy } from "./utils/IGenerateBookingInvoiceActionStrategy";

export class GenerateBookingInvoice {
    private thUtils: ThUtils;
    private generateBookingInvoiceDO: GenerateBookingInvoiceDO;

    private loadedBooking: BookingDO;
    private initialInvoiceItemList: BookingInvoiceItem[];

    constructor(private appContext: AppContext, private sessionContext: SessionContext) {
        this.thUtils = new ThUtils();
    }

    public generate(generateBookingInvoiceDO: GenerateBookingInvoiceDO): Promise<InvoiceDO> {
        this.generateBookingInvoiceDO = generateBookingInvoiceDO;
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.generateCore(resolve, reject);
        });
    }

    private generateCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        var validationResult = GenerateBookingInvoiceDO.getValidationStructure().validateStructure(this.generateBookingInvoiceDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this.generateBookingInvoiceDO);
            parser.logAndReject("Error validating data for Generate Booking Invoice", reject);
            return;
        }

        var bookignRepo = this.appContext.getRepositoryFactory().getBookingRepository();
        bookignRepo.getBookingById({ hotelId: this.sessionContext.sessionDO.hotel.id }, this.generateBookingInvoiceDO.id)
            .then((booking: BookingDO) => {
                this.loadedBooking = booking;
                this.initialInvoiceItemList = this.getInitialInvoiceItems();

                let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
                return invoiceRepo.getInvoiceList({ hotelId: this.sessionContext.sessionDO.hotel.id }, {
                    bookingId: this.loadedBooking.id,
                    invoiceAccountingType: InvoiceAccountingType.Debit
                });
            }).then((invoiceSearchResult: InvoiceSearchResultRepoDO) => {
                if (invoiceSearchResult.invoiceList.length > 0) {
                    resolve(invoiceSearchResult.invoiceList[0]);
                    return;
                }
                let actionFactory = new GenerateBookingInvoiceActionFactory(this.appContext, this.sessionContext);
                actionFactory.getActionStrategy(this.loadedBooking, this.initialInvoiceItemList)
                    .then((strategy: IGenerateBookingInvoiceActionStrategy) => {
                        strategy.generateBookingInvoice(resolve, reject);
                    }).catch(e => { throw e; });
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.GenerateBookingInvoiceError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error generating invoice related to booking", this.generateBookingInvoiceDO, thError);
                reject(thError);
            });
    }

    private getInitialInvoiceItems(): BookingInvoiceItem[] {
        if (this.loadedBooking.price.isPenalty()) {
            return;
        }
        let initialAddOnProducts = this.buildInitialInvoiceItems(this.loadedBooking.reservedAddOnProductList);
        return initialAddOnProducts;
        };

    private buildInitialInvoiceItems(addOnProductList: AddOnProductBookingReservedItem[]): BookingInvoiceItem[] {
        if (this.thUtils.isUndefinedOrNull(addOnProductList) || !_.isArray(addOnProductList)) {
            return [];
        }
        var reservedItems: BookingInvoiceItem[] = [];
        addOnProductList.forEach((item: AddOnProductBookingReservedItem) => {
            reservedItems.push({
                addOnProductSnapshot: item.aopSnapshot,
                noOfItems: item.noOfItems
            });
            
        });
        return reservedItems;
    }
}
