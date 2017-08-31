import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { HotelOperationsPageControllerService } from '../../../../services/HotelOperationsPageControllerService';
import { BookingOperationsPageData } from '../../services/utils/BookingOperationsPageData';
import { HotelOperationsBookingService } from "../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService";
import { InvoiceGroupDO } from "../../../../../../../../../../../services/invoices-deprecated/data-objects/InvoiceGroupDO";
import { BookingGenerateInvoiceRight } from "../../../../../../../../../../../services/bookings/data-objects/BookingEditRights";

@Component({
    selector: 'booking-links',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/booking-links/template/booking-links.html'
})
export class BookingLinksComponent {
    @Input() bookingOperationsPageData: BookingOperationsPageData;

    @Output() onInvoiceGenerated = new EventEmitter<InvoiceGroupDO>();
    public triggerOnInvoiceGenerated(invoiceGroup: InvoiceGroupDO) {
        this.onInvoiceGenerated.next(invoiceGroup);
    }

    private isSaving: boolean = false;

    constructor(private _appContext: AppContext,
        private _operationsPageControllerService: HotelOperationsPageControllerService,
        private _hotelOperationsBookingService: HotelOperationsBookingService) { }

    public get hasInvoice(): boolean {
        return this.bookingOperationsPageData.hasInvoice;
    }
    public get invoiceIsPaid(): boolean {
        return this.bookingOperationsPageData.invoiceDO.isPaid;
    }
    public viewInvoice() {
        if (!this.hasInvoice) { return; }
        this._operationsPageControllerService.goToInvoice(this.bookingOperationsPageData.invoiceGroupDO.id, {
            bookingId: this.bookingOperationsPageData.bookingDO.id
        }, false);
    }

    public get hasRoom(): boolean {
        return this.bookingOperationsPageData.hasRoom;
    }
    public viewRoom() {
        if (!this.hasRoom) { return; }
        this._operationsPageControllerService.goToRoom(this.bookingOperationsPageData.bookingDO.roomId);
    }
    public get hasGenerateInvoiceRight(): boolean {
        return this.bookingOperationsPageData.bookingMeta.generateInvoiceRight === BookingGenerateInvoiceRight.Allowed;
    }

    private generateInvoice() {
        if (!this.hasGenerateInvoiceRight || this.isSaving) { return; }
        var title = this._appContext.thTranslation.translate("Generate Invoice");
        var content = this._appContext.thTranslation.translate("Are you sure you want to generate the associated invoice for this booking?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.generateInvoiceCore();
            }, () => { });
    }
    private generateInvoiceCore() {
        this.isSaving = true;
        this._hotelOperationsBookingService.generateInvoice(this.bookingOperationsPageData.bookingDO)
            .subscribe((updatedBooking: InvoiceGroupDO) => {
                this._appContext.analytics.logEvent("booking", "generate-invoice", "Generated an invoice for a booking");
                this.isSaving = false;
                this.triggerOnInvoiceGenerated(updatedBooking);
            }, (error: ThError) => {
                this.isSaving = false;
                this._appContext.toaster.error(error.message);
            });
    }
}
