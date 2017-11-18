import _ = require("underscore");
import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { ThUtils } from '../../../../core/utils/ThUtils';
import { TaxDO } from '../../../data-layer/taxes/data-objects/TaxDO';
import { InvoiceItemDO, InvoiceItemType } from "../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { InvoiceAccountingType } from '../../../data-layer/invoices/data-objects/InvoiceDO';
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { BookingPriceDO } from "../../../data-layer/bookings/data-objects/price/BookingPriceDO";
import { RoomDO } from "../../../data-layer/rooms/data-objects/RoomDO";
import { CurrencyDO } from "../../../data-layer/common/data-objects/currency/CurrencyDO";

export class InvoiceItemVM {
    private _thUtils: ThUtils;

    name: string;
    qty: number;

    netUnitPrice: number;
    netUnitPriceFormatted: string;

    unitPriceInclVat: number;
    unitPriceInclVatFormatted: string;

    vat: number;
    vatFormatted: string;

    vatPercentage: number;
    vatPercentageFormatted: string;

    subtotal: number;
    subtotalFormatted: string;

    subtotalInclVat: number;
    subtotalInclVatFormatted: string;

    isLastOne: boolean;

    subtitle: string;

    decimalsNo: number;

    constructor(private translation: ThTranslation) {
        this._thUtils = new ThUtils();
        this.isLastOne = false;
        this.subtitle = "";
    }

    public buildFromInvoiceItemDO(invoiceItemDO: InvoiceItemDO, vatTaxList: TaxDO[], accountingType: InvoiceAccountingType, ccy?: CurrencyDO) {
        this.name = invoiceItemDO.meta.getDisplayName(this.translation);
        this.qty = invoiceItemDO.meta.getNumberOfItems() * this.getAccountingFactor(accountingType);
        this.decimalsNo = (ccy) ? ccy.decimalsNo : 2;
        var vatValue = this.getVatValue(invoiceItemDO.meta.getVatId(), vatTaxList);
        this.vatPercentage = this._thUtils.roundNumber(vatValue * 100, 2);
        this.unitPriceInclVat = this._thUtils.roundNumber(invoiceItemDO.meta.getUnitPrice(), this.decimalsNo);
        this.netUnitPrice = this._thUtils.roundNumber(invoiceItemDO.meta.getUnitPrice() / (1 + vatValue), this.decimalsNo);
        var unitVat = this._thUtils.roundNumber(invoiceItemDO.meta.getUnitPrice() - this.netUnitPrice, this.decimalsNo);
        this.vat = this._thUtils.roundNumber(unitVat * this.qty, this.decimalsNo);
        this.subtotal = this._thUtils.roundNumber(this.qty * this.netUnitPrice, this.decimalsNo);
        this.subtotalInclVat = this._thUtils.roundNumber(this.qty * (this.netUnitPrice + unitVat), this.decimalsNo);

        this.formatPrices();
    }
    public attachBookingDetailsIfNecessary(invoiceItemDO: InvoiceItemDO, customerList: CustomerDO[], roomList: RoomDO[]) {
        this.subtitle = "";
        if (invoiceItemDO.type != InvoiceItemType.Booking) {
            return;
        }
        let price = <BookingPriceDO>invoiceItemDO.meta;

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
        this.vatPercentageFormatted = this._thUtils.formatNumber(this.vatPercentage, 2);
        this.netUnitPriceFormatted = this._thUtils.formatNumber(this.netUnitPrice, this.decimalsNo);
        this.vatFormatted = this._thUtils.formatNumber(this.vat, this.decimalsNo);
        this.subtotalFormatted = this._thUtils.formatNumber(this.subtotal, this.decimalsNo);
        this.unitPriceInclVatFormatted = this._thUtils.formatNumber(this.unitPriceInclVat, this.decimalsNo);
        this.subtotalInclVatFormatted = this._thUtils.formatNumber(this.subtotalInclVat, this.decimalsNo);
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
