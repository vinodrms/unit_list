import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { HotelOperationsPageControllerService } from '../../../../services/HotelOperationsPageControllerService';
import { BookingOperationsPageData } from '../../services/utils/BookingOperationsPageData';
import { HotelOperationsBookingService } from "../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService";
import { BookingGenerateInvoiceRight } from "../../../../../../../../../../../services/bookings/data-objects/BookingEditRights";
import { InvoiceDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { BookingDO } from "../../../../../../../../../../../services/bookings/data-objects/BookingDO";
import { EagerBookingsService } from "../../../../../../../../../../../services/bookings/EagerBookingsService";
import { BookingsDO } from "../../../../../../../../../../../services/bookings/data-objects/BookingsDO";
import { Observable } from "rxjs/Observable";

import _ = require('underscore');

@Component({
    selector: 'booking-links',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/booking-links/template/booking-links.html'
})
export class BookingLinksComponent {
    @Input() bookingOperationsPageData: BookingOperationsPageData;

    @Output() onInvoiceGenerated = new EventEmitter<InvoiceDO>();
    public triggerOnInvoiceGenerated(invoice: InvoiceDO) {
        this.onInvoiceGenerated.next(invoice);
    }

    private isSaving: boolean = false;
    private showProgressBar: boolean = false;
    private progressBarFillPercentage: number = 0;

    constructor(private _appContext: AppContext,
        private _operationsPageControllerService: HotelOperationsPageControllerService,
        private _hotelOperationsBookingService: HotelOperationsBookingService,
        private _eagerBookingsService: EagerBookingsService) { }

    public get hasInvoice(): boolean {
        return this.bookingOperationsPageData.hasInvoice;
    }
    public get invoiceIsPaid(): boolean {
        return this.bookingOperationsPageData.invoiceDO.isPaid();
    }
    public viewInvoice() {
        if (!this.hasInvoice) { return; }
        this._operationsPageControllerService.goToInvoice(this.bookingOperationsPageData.invoiceDO.id);
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
            .subscribe((createdInvoice: InvoiceDO) => {
                this._appContext.analytics.logEvent("booking", "generate-invoice", "Generated an invoice for a booking");
                this.isSaving = false;
                this.triggerOnInvoiceGenerated(createdInvoice);
            }, (error: ThError) => {
                this.isSaving = false;
                this._appContext.toaster.error(error.message);
            });
    }
    public get canGenerateInvoice(): boolean {
        return this.hasGenerateInvoiceRight && !this.hasInvoice;
    }
    public get canGenerateAllInvoicesForBookingGroup(): boolean {
        return this.hasGenerateInvoiceRight && this.bookingOperationsPageData.bookingDO.mergeInvoice && !this.hasInvoice;
    }
    private generateAllInvoicesForBookingGroup() {
        if (!this.hasGenerateInvoiceRight || !this.bookingOperationsPageData.bookingDO.mergeInvoice || this.isSaving) { return; }
        var title = this._appContext.thTranslation.translate("Generate Invoices For All Bookings From This Group");
        var content = this._appContext.thTranslation.translate("Are you sure you want to generate invoices for all bookings from this group?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.generateAllInvoicesForBookingGroupCore();
            }, () => { });
    }    
    private generateAllInvoicesForBookingGroupCore() {
        this.isSaving = true;
        this.showProgressBar = true;
        var bookings: BookingDO[] = [];
        this._eagerBookingsService.getBookingsByGroupBookingId(this.bookingOperationsPageData.bookingDO.groupBookingId).subscribe((bookings: BookingsDO) => {
            var bookingsIndex = 0;
            var concatenatedObservables: Observable<InvoiceDO>;
            _.each(bookings.bookingList, (booking: BookingDO) => {
                if (!concatenatedObservables) {
                    concatenatedObservables = this._hotelOperationsBookingService.generateInvoice(booking);
                } else {
                    concatenatedObservables = concatenatedObservables.concat(this._hotelOperationsBookingService.generateInvoice(booking));
                }
            });
            var createdInvoicesCount = 0;
            concatenatedObservables.subscribe((createdInvoice: InvoiceDO) => {
                        this._appContext.analytics.logEvent("booking", "generate-invoice", "Generated an invoice for a booking");
                        this.triggerOnInvoiceGenerated(createdInvoice);
                        createdInvoicesCount++;
                        this.progressBarFillPercentage = createdInvoicesCount * 100 / bookings.bookingList.length;
                        if (createdInvoicesCount == bookings.bookingList.length) {
                            this.isSaving = false;
                            this.showProgressBar = false;
                        }
                    }, (error: ThError) => {
                        this.isSaving = false;
                        this.showProgressBar = false;
                        this._appContext.toaster.error(error.message);
                    });
 
        }, (error: ThError) => {
            this.isSaving = false;
            this.showProgressBar = false;
            this._appContext.toaster.error(error.message);
        });
    }
}
