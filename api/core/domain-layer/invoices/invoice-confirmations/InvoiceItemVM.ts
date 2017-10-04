import _ = require("underscore");
import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { ThUtils } from '../../../../core/utils/ThUtils';
import { TaxDO } from '../../../data-layer/taxes/data-objects/TaxDO';
import { InvoiceItemDO, InvoiceItemType } from "../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { InvoiceAccountingType } from '../../../data-layer/invoices/data-objects/InvoiceDO';
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { BookingPriceDO } from "../../../data-layer/bookings/data-objects/price/BookingPriceDO";
import { RoomDO } from "../../../data-layer/rooms/data-objects/RoomDO";

export class InvoiceItemVM {
    private _thUtils: ThUtils;

    name: string;
    qty: number;

    netUnitPrice: number;
    netUnitPriceFormatted: string;

    vat: number;
    vatFormatted: string;

    vatPercentage: number;
    vatPercentageFormatted: string;

    subtotal: number;
    subtotalFormatted: string;

    isLastOne: boolean;

    subtitle: string;

    constructor(private translation: ThTranslation) {
        this._thUtils = new ThUtils();
        this.isLastOne = false;
    }

    public buildFromInvoiceItemDO(invoiceItemDO: InvoiceItemDO, vatTaxList: TaxDO[], accountingType: InvoiceAccountingType) {
        this.name = invoiceItemDO.meta.getDisplayName(this.translation);
        this.qty = invoiceItemDO.meta.getNumberOfItems() * this.getAccountingFactor(accountingType);

        var vatValue = this.getVatValue(invoiceItemDO.meta.getVatId(), vatTaxList);
        this.vatPercentage = this._thUtils.roundNumberToTwoDecimals(vatValue * 100);
        this.netUnitPrice = this._thUtils.roundNumberToTwoDecimals(invoiceItemDO.meta.getUnitPrice() / (1 + vatValue));
        var unitVat = this._thUtils.roundNumberToTwoDecimals(invoiceItemDO.meta.getUnitPrice() - this.netUnitPrice);
        this.vat = this._thUtils.roundNumberToTwoDecimals(unitVat * this.qty);
        this.subtotal = this._thUtils.roundNumberToTwoDecimals(this.qty * this.netUnitPrice);

        this.formatPrices();
    }
    public attachBookingDetailsIfNecessary(invoiceItemDO: InvoiceItemDO, customerList: CustomerDO[], roomList: RoomDO[]) {
        this.subtitle = "";
        if (invoiceItemDO.type != InvoiceItemType.Booking) {
            return;
        }
        let price = <BookingPriceDO​​>invoiceItemDO.meta;

        if (_.isString(price.externalBookingReference) && price.externalBookingReference.length > 0) {
            this.subtitle += this.translation.translate("Ext Ref %extRef%", {
                extRef: price.externalBookingReference
            });
        }

        if (_.isString(price.displayedReservationNumber) && price.displayedReservationNumber.length > 0) {
            if (this.subtitle.length > 0) { this.subtitle += ", "; }
            this.subtitle += this.translation.translate("Ref %ref%", {
                ref: price.displayedReservationNumber
            });
        }

        if (_.isString(price.customerId) && price.customerId.length > 0) {
            let customer: CustomerDO = _.find(customerList, (c: CustomerDO) => { return c.id === price.customerId; });
            if (customer) {
                if (this.subtitle.length > 0) { this.subtitle += ", "; }
                this.subtitle += this.translation.translate("Guest %guest%", {
                    guest: customer.customerDetails.getName()
                });
            }
        }

        if (_.isString(price.roomId) && price.roomId.length > 0) {
            let room: RoomDO = _.find(roomList, (r: RoomDO) => { return r.id === price.roomId; });
            if (room) {
                if (this.subtitle.length > 0) { this.subtitle += ", "; }
                this.subtitle += this.translation.translate("Room %room%", {
                    room: room.name
                });
            }
        }

    }
    private getAccountingFactor(accountingType: InvoiceAccountingType): number {
        if (accountingType === InvoiceAccountingType.Credit) {
            return -1;
        }
        return 1;
    }
    public formatPrices() {
        this.vatPercentageFormatted = this._thUtils.formatNumberToTwoDecimals(this.vatPercentage);
        this.netUnitPriceFormatted = this._thUtils.formatNumberToTwoDecimals(this.netUnitPrice);
        this.vatFormatted = this._thUtils.formatNumberToTwoDecimals(this.vat);
        this.subtotalFormatted = this._thUtils.formatNumberToTwoDecimals(this.subtotal);
    }

    private getVatValue(vatId: string, vatTaxList: TaxDO[]): number {
        if (this._thUtils.isUndefinedOrNull(vatId)) {
            return 0.0;
        }
        var vat = _.find(vatTaxList, (vat: TaxDO) => {
            return vat.id === vatId;
        });
        if (this._thUtils.isUndefinedOrNull(vat)) {
            return 0.0;
        }
        return vat.value;
    }
}
