import {Component, Input, Output, NgZone, ElementRef, EventEmitter} from '@angular/core';

import {HotelDashboardModalService} from '../../../../services/HotelDashboardModalService';
import { DepartureItemInfoVM } from '../../../../../../../../../../services/hotel-operations/dashboard/departures/view-models/DepartureItemInfoVM'
import { AppContext, ThError } from "../../../../../../../../../../../../common/utils/AppContext";
import { HotelOperationsRoomService } from "../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService";
import { CheckOutRoomParam } from "../../../../../../../../../../services/hotel-operations/room/utils/CheckOutRoomParam";
import { BookingDO } from "../../../../../../../../../../services/bookings/data-objects/BookingDO";
import { InvoicePaymentStatus, InvoiceDO } from "../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { EagerInvoiceGroupsService } from "../../../../../../../../../../services/invoices/EagerInvoiceGroupsService";
import { InvoiceGroupDO } from "../../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO";
import { InvoiceGroupsService } from "../../../../../../../../../../services/invoices/InvoiceGroupsService";

declare var $: any;

@Component({
    selector: 'departure-item',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/departures-pane/components/departure-item/template/departure-item.html',
    providers: [EagerInvoiceGroupsService, InvoiceGroupsService]
})

export class DepartureItemComponent {
    @Input() departureItemVM: DepartureItemInfoVM;
    @Output() onCheckOut = new EventEmitter();

    isCheckingOut: boolean = false;

    constructor(private _zone: NgZone,
        private _root: ElementRef,
        private _modalService: HotelDashboardModalService,
        private _appContext: AppContext,
        private _hotelOperationsRoomService: HotelOperationsRoomService,
        private _eagerInvoiceGroupsService: EagerInvoiceGroupsService,
        private _invoiceGroupsService: InvoiceGroupsService
    ) {
    }

    ngAfterViewInit() {
    }

    public openCustomerModal() {
        var customerId = this.departureItemVM.departureItemDO.customerId;
        this._modalService.openCustomerModal(customerId);
    }

    public openCorporateCustomerModal() {
        var customerId = this.departureItemVM.departureItemDO.corporateCustomerId;
        this._modalService.openCustomerModal(customerId);
    }

    public checkOut() {
        if (!this.departureItemVM.canCheckOut || this.isCheckingOut) { return; }

        var title = this._appContext.thTranslation.translate("Check Out");
        var content = this._appContext.thTranslation.translate("Are you sure you want to check out this room?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.checkOutCore();
            }, () => { });
    }

    private checkOutCore() {
        this.isCheckingOut = true;

        var chechOutParams: CheckOutRoomParam = {
            bookingId: this.departureItemVM.departureItemDO.bookingId,
            groupBookingId: this.departureItemVM.departureItemDO.groupBookingId
        }
        this._hotelOperationsRoomService.checkOut(chechOutParams).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("room", "check-out", "Checked out a room");
            this.isCheckingOut = false;
            this.onCheckOut.emit();
        }, (error: ThError) => {
            this.isCheckingOut = false;
            this._appContext.toaster.error(error.message);
        });
    }

    public payInvoice() {
        var title = this._appContext.thTranslation.translate("Info");
        var content = this._appContext.thTranslation.translate("By marking this invoice as paid you acknowledge that all payments were made. Continue?");
        var positiveLabel = this._appContext.thTranslation.translate("Yes");
        var negativeLabel = this._appContext.thTranslation.translate("No");
        this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            this.payInvoiceCore();
        });
    }

    private payInvoiceCore() {
        if (!this.departureItemVM.departureItemDO.invoiceGroupId) { return; }

        this._eagerInvoiceGroupsService.getInvoiceGroup(
            this.departureItemVM.departureItemDO.invoiceGroupId
        ).subscribe((invoiceGroup: InvoiceGroupDO) => {
                _.forEach(invoiceGroup.invoiceList, (invoice: InvoiceDO) => {
                    if (invoice.id == this.departureItemVM.departureItemDO.invoiceId) {
                        invoice.paymentStatus = InvoicePaymentStatus.Paid;
                    }
                });
                this._invoiceGroupsService.saveInvoiceGroupDO(invoiceGroup).subscribe((updatedInvoiceGroupDO: InvoiceGroupDO) => {
                this._appContext.analytics.logEvent("invoice", "paid", "Marked an invoice as paid");
                this._appContext.toaster.success(this._appContext.thTranslation.translate("The invoice was paid succesfully."));
                this.onCheckOut.emit();
            }, (error: ThError) => {
                this._appContext.toaster.error(error.message);
            });
        });
    }

    public openBookingNotesModal() {
        var bookingNotes = this.departureItemVM.departureItemDO.bookingNotes;
        this._modalService.openBookingNotesModal(bookingNotes);
    }
}