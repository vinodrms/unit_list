import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {InvoiceTestUtils} from '../utils/InvoiceTestUtils';
import {SaveInvoiceGroupBuilder} from '../builders/SaveInvoiceGroupBuilder';
import {SaveInvoiceGroupDO} from '../../../../../core/domain-layer/invoices/save-invoice-group/SaveInvoiceGroupDO';
import {InvoiceBuilder} from '../builders/InvoiceBuilder';
import {InvoicePayerBuilder} from '../builders/InvoicePayerBuilder';
import {InvoiceGroupDO} from '../../../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoicePaymentStatus} from '../../../../../core/data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceItemDO} from '../../../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO';
import {IInvoiceItemMeta} from '../../../../../core/data-layer/invoices/data-objects/items/IInvoiceItemMeta';
import {GenerateBookingInvoiceDO} from '../../../../../../api/core/domain-layer/invoices/generate-booking-invoice/GenerateBookingInvoiceDO';

export class BookingInvoicesTestHelper {

    private _invoiceTestUtils: InvoiceTestUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._invoiceTestUtils = new InvoiceTestUtils();
    }

    public buildGenerateBookingInvoiceDOForNewInvoiceGroup(): GenerateBookingInvoiceDO {
        var bookingList = this._defaultDataBuilder.bookingList;
        var booking = bookingList[0];

        return {
            groupBookingId: booking.groupBookingId,
            bookingId: booking.bookingId
        };
    }

    public buildGenerateBookingInvoiceDOForExistingInvoiceGroup(): GenerateBookingInvoiceDO {
        var bookingList = this._defaultDataBuilder.bookingList;
        var booking = bookingList[1];

        return {
            groupBookingId: booking.groupBookingId,
            bookingId: booking.bookingId
        };
    }

    public buildSaveInvoiceGroupDOForUpdatingBookingInvoiceGroup(invoiceGroupToUpdate: InvoiceGroupDO): Promise<SaveInvoiceGroupDO> {
        return new Promise<SaveInvoiceGroupDO>((resolve: { (result: SaveInvoiceGroupDO): void }, reject: { (err: any): void }) => {
            try {
                this.buildSaveInvoiceGroupDOForUpdatingBookingInvoiceGroupCore(invoiceGroupToUpdate, resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    public buildSaveInvoiceGroupDOForUpdatingBookingInvoiceGroupCore(invoiceGroupToUpdate: InvoiceGroupDO,
        resolve: { (result: SaveInvoiceGroupDO): void }, reject: { (err: any): void }) {
        invoiceGroupToUpdate.invoiceList[0].paymentStatus = InvoicePaymentStatus.Closed;

        var aopItemList = this._invoiceTestUtils.buildRandomItemListOfAddOnProducts(this._defaultDataBuilder.addOnProductList, 2);
        var aopItemMetaPromiseList = [];
        _.forEach(aopItemList, (aopItem: InvoiceItemDO) => {
            aopItemMetaPromiseList.push(aopItem.meta);
        })
        Promise.all(aopItemMetaPromiseList).then((invoiceItemMetaList: IInvoiceItemMeta[]) => {
            this._invoiceTestUtils.getTotalPriceFromItemMetaList(invoiceItemMetaList).then((totalPrice: number) => {
                var invoicePayer = invoiceGroupToUpdate.invoiceList[0].payerList[0];
                var invoicePayerWithUpdatedPricetoPay = new InvoicePayerBuilder()
                    .withCustomerId(invoicePayer.customerId)
                    .withPaymentMethod(invoicePayer.paymentMethod)
                    .withPriceToPay(totalPrice).build();
                
                invoiceGroupToUpdate.invoiceList.push(new InvoiceBuilder()
                    .withItemList(aopItemList)
                    .withPayerList([invoicePayerWithUpdatedPricetoPay])
                    .withPaymentStatus(InvoicePaymentStatus.Open)
                    .build());
                resolve(
                    new SaveInvoiceGroupBuilder()
                        .withId(invoiceGroupToUpdate.id)
                        .withGroupBookingId(invoiceGroupToUpdate.groupBookingId)
                        .withInvoiceList(invoiceGroupToUpdate.invoiceList)
                        .withPaymentStatus(InvoicePaymentStatus.Open)
                        .build()
                );
            });
        }).catch((error) => {
            reject(error);
        })
    }

    private getOneBookingIdFromInvoiceGroup(invoiceGroup: InvoiceGroupDO): string {
        return invoiceGroup.invoiceList[0].bookingId;
    }
}