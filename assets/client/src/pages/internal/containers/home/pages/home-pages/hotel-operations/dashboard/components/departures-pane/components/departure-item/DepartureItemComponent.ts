import { Component, Input, Output, NgZone, ElementRef, EventEmitter } from '@angular/core';

import { HotelDashboardModalService } from '../../../../services/HotelDashboardModalService';
import { DepartureItemInfoVM, DepartureItemInvoiceInfoVM } from '../../../../../../../../../../services/hotel-operations/dashboard/departures/view-models/DepartureItemInfoVM'
import { AppContext, ThError } from "../../../../../../../../../../../../common/utils/AppContext";
import { HotelOperationsRoomService } from "../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService";
import { CheckOutRoomParam } from "../../../../../../../../../../services/hotel-operations/room/utils/CheckOutRoomParam";
import { BookingDO } from "../../../../../../../../../../services/bookings/data-objects/BookingDO";
import { InvoicePaymentStatus, InvoiceDO } from "../../../../../../../../../../services/invoices-deprecated/data-objects/InvoiceDO";
import { EagerInvoiceGroupsServiceDeprecated } from "../../../../../../../../../../services/invoices-deprecated/EagerInvoiceGroupsService";
import { InvoiceGroupDO } from "../../../../../../../../../../services/invoices-deprecated/data-objects/InvoiceGroupDO";
import { InvoiceGroupsServiceDeprecated } from "../../../../../../../../../../services/invoices-deprecated/InvoiceGroupsService";

declare var $: any;

@Component({
    selector: 'departure-item',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/departures-pane/components/departure-item/template/departure-item.html',
    host: {
        '(document:click)': 'onClick($event)',
    },
    providers: [EagerInvoiceGroupsServiceDeprecated, InvoiceGroupsServiceDeprecated]
})

export class DepartureItemComponent {
    @Input() departureItemVM: DepartureItemInfoVM;
    @Output() onCheckOut = new EventEmitter();

    isCheckingOut: boolean = false;

    shouldShowPayDropdown: boolean = false;

    constructor(private _zone: NgZone,
        private _root: ElementRef,
        private _modalService: HotelDashboardModalService,
        private _appContext: AppContext,
        private _hotelOperationsRoomService: HotelOperationsRoomService,
        private _eagerInvoiceGroupsServiceDeprecated: EagerInvoiceGroupsServiceDeprecated,
        private _invoiceGroupsServiceDeprecated: InvoiceGroupsServiceDeprecated
    ) {
    }

    ngAfterViewInit() {
    }

    public openPayInvoiceDropdown() {
        this.shouldShowPayDropdown = true;
    }

    public openInvoiceModal(invoiceInfo: DepartureItemInvoiceInfoVM) {
        this.shouldShowPayDropdown = false;

        this._modalService.openInvoiceModal(invoiceInfo.invoiceGroupId, { invoiceId: invoiceInfo.invoiceId });
    }

    public openCustomerModal() {
        var customerId = this.departureItemVM.departureItemContainingCustomerInfo.customerId;
        this._modalService.openCustomerModal(customerId);
    }

    public openCorporateCustomerModal() {
        var customerId = this.departureItemVM.departureItemContainingCustomerInfo.corporateCustomerId;
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
            bookingId: this.departureItemVM.departureItemContainingCustomerInfo.bookingId,
            groupBookingId: this.departureItemVM.departureItemContainingCustomerInfo.groupBookingId
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

    public openBookingNotesModal() {
        var bookingNotes = this.departureItemVM.departureItemContainingCustomerInfo.bookingNotes;
        this._modalService.openBookingNotesModal(bookingNotes);
    }

    public getPayDropdownClasses(): string {
        return this.shouldShowPayDropdown ? 'pay-dropdown-content show' : 'pay-dropdown-content';
    }

    public onClick(event) {
        if (!this.eventTriggeredInsideHost(event)) {
            this.shouldShowPayDropdown = false;
        }
    }

    public eventTriggeredInsideHost(event) {
        var current = event.target;
        // Reach under the hood to get the actual DOM element that is
        // being used to render the component.
        var host = this._root.nativeElement;
        // Here, we are going to walk up the DOM tree, checking to see
        // if we hit the "host" node. If we hit the host node at any
        // point, we know that the target must reside within the local
        // tree of the host.
        do {
            // If we hit the host node, we know that the target resides
            // within the host component.
            if (current === host) {
                return (true);
            }
            current = current.parentNode;
        } while (current);
        // If we made it this far, we never encountered the host
        // component as we walked up the DOM tree. As such, we know that
        // the target resided outside of the host component.
        return (false);
    }
}
