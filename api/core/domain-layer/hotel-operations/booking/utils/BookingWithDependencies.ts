import { BookingDO } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { PriceProductDO } from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductsContainer } from '../../../price-products/validators/results/PriceProductsContainer';
import { AllotmentDO, AllotmentStatus } from '../../../../data-layer/allotments/data-objects/AllotmentDO';
import { AllotmentsContainer } from '../../../allotments/validators/results/AllotmentsContainer';
import { RoomDO } from '../../../../data-layer/rooms/data-objects/RoomDO';
import { RoomCategoryStatsDO } from '../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { ThUtils } from '../../../../utils/ThUtils';
import { CustomerDO } from "../../../../data-layer/customers/data-objects/CustomerDO";

import _ = require('underscore');

export class BookingWithDependencies {
    private _thUtils: ThUtils;
    private _bookingDO: BookingDO;

    private _priceProductsContainer: PriceProductsContainer;
    private _priceProductDO: PriceProductDO;

    private _allotmentsContainer: AllotmentsContainer;
    private _allotmentDO: AllotmentDO;

    private _roomList: RoomDO[];
    private _roomCategoryStatsList: RoomCategoryStatsDO[];

    private _invoiceGroupList: InvoiceGroupDO[];

    private _billingCustomer: CustomerDO;

    constructor() {
        this._thUtils = new ThUtils();
    }

    public get bookingDO(): BookingDO {
        return this._bookingDO;
    }
    public set bookingDO(bookingDO: BookingDO) {
        this._bookingDO = bookingDO;
    }

    public get priceProductsContainer(): PriceProductsContainer {
        return this._priceProductsContainer;
    }
    public set priceProductsContainer(priceProductsContainer: PriceProductsContainer) {
        this._priceProductsContainer = priceProductsContainer;
        this._priceProductDO = priceProductsContainer.priceProductList[0];
    }
    public get priceProductDO(): PriceProductDO {
        return this._priceProductDO;
    }
    public set priceProductDO(priceProductDO: PriceProductDO) {
        this._priceProductDO = priceProductDO;
    }


    public get allotmentsContainer(): AllotmentsContainer {
        return this._allotmentsContainer;
    }
    public set allotmentsContainer(allotmentsContainer: AllotmentsContainer) {
        this._allotmentsContainer = allotmentsContainer;
        if (this._bookingDO.isMadeThroughAllotment()) {
            this._allotmentDO = this._allotmentsContainer.allotmentList[0];
        }
    }
    public get allotmentDO(): AllotmentDO {
        return this._allotmentDO;
    }
    public set allotmentDO(allotmentDO: AllotmentDO) {
        this._allotmentDO = allotmentDO;
    }

    public get roomList(): RoomDO[] {
        return this._roomList;
    }
    public set roomList(roomList: RoomDO[]) {
        this._roomList = roomList;
    }
    public get roomCategoryStatsList(): RoomCategoryStatsDO[] {
        return this._roomCategoryStatsList;
    }
    public set roomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]) {
        this._roomCategoryStatsList = roomCategoryStatsList;
    }
    public get invoiceGroupList(): InvoiceGroupDO[] {
        return this._invoiceGroupList;
    }
    public set invoiceGroupList(invoiceGroupList: InvoiceGroupDO[]) {
        this._invoiceGroupList = invoiceGroupList;
    }
    public get billingCustomer(): CustomerDO {
        return this._billingCustomer;
    }
    public set billingCustomer(billingCustomer: CustomerDO) {
        this._billingCustomer = billingCustomer;
    }

    public isMadeThroughActiveAllotment(): boolean {
        return this._bookingDO.isMadeThroughAllotment()
            && !this._thUtils.isUndefinedOrNull(this._allotmentDO)
            && this.allotmentDO.status === AllotmentStatus.Active;
    }

    public hasClosedInvoice(): boolean {
        let invoiceGroup = this.getInvoiceGroupDO();
        if (this._thUtils.isUndefinedOrNull(invoiceGroup)) { return false; }

        let invoice = invoiceGroup.getInvoiceForBooking(this._bookingDO.bookingId);
        if (this._thUtils.isUndefinedOrNull(invoice)) { return false; }
        return invoice.isClosed();
    }

    public getInvoiceGroupDO(): InvoiceGroupDO {
        if (this._invoiceGroupList.length == 0) { return null; }
        return _.find(this._invoiceGroupList, (groupInvoice: InvoiceGroupDO) => {
            return groupInvoice.groupBookingId === this._bookingDO.groupBookingId;
        });
    }
}