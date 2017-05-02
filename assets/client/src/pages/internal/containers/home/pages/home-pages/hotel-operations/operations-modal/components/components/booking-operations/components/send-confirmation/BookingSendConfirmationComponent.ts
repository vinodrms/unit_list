import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingSendConfirmationRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {EmailSenderModalService} from '../../../../../../email-sender/services/EmailSenderModalService';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';

@Component({
    selector: 'booking-send-confirmation',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/send-confirmation/template/booking-send-confirmation.html',
    providers: [EmailSenderModalService]
})
export class BookingSendConfirmationComponent implements OnInit {
    private _bookingConfirmationsBlocked: boolean;

    private _bookingOperationsPageData: BookingOperationsPageData;
    public get bookingOperationsPageData(): BookingOperationsPageData {
        return this._bookingOperationsPageData;
    }
    @Input()
    public set bookingOperationsPageData(bookingOperationsPageData: BookingOperationsPageData) {
        this._bookingOperationsPageData = bookingOperationsPageData;
        this.loadDependentData();
    }

    private _didInit: boolean = false;

    constructor(private _appContext: AppContext,
        private _emailSenderModalService: EmailSenderModalService) { }

    ngOnInit() {
        this._didInit = true;
        this._bookingConfirmationsBlocked = false;

        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }

        this.checkIfBookingConfirmationsShouldBeBlocked();
    }

    private checkIfBookingConfirmationsShouldBeBlocked() {
        var allCustomers = this._bookingOperationsPageData.customersContainer.customerList;
        var customersAbleToReceiveConfirmations = this.getCustomersAllowedToReceiveConfirmations();

        if(!_.isEmpty(allCustomers) && allCustomers.length > customersAbleToReceiveConfirmations.length) {
            this._bookingConfirmationsBlocked = true;
        }
    }

    private getCustomersAllowedToReceiveConfirmations(): CustomerDO[] {
        var allCustomers = this._bookingOperationsPageData.customersContainer.customerList;
        return _.filter(allCustomers, (customer: CustomerDO) => {
            return customer.customerDetails.canReceiveBookingConfirmations();
        });
    }

    public get hasSendRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.sendConfirmationRight === BookingSendConfirmationRight.Send;
    } 

    public get bookingConfirmationsBlocked(): boolean {
        return this._bookingConfirmationsBlocked;
    }

    public send() {
        if (!this.hasSendRight) { return; }
        
        var customersAbleToReceiveConfirmations = this.getCustomersAllowedToReceiveConfirmations();
        var groupBookingId = this._bookingOperationsPageData.bookingDO.groupBookingId;
        var bookingId = this._bookingOperationsPageData.bookingDO.id;
        this._emailSenderModalService.sendBookingConfirmation(customersAbleToReceiveConfirmations, groupBookingId, bookingId).then((modalDialogRef: ModalDialogRef<boolean>) => {
            modalDialogRef.resultObservable.subscribe((sendResult: boolean) => {
                this._appContext.analytics.logEvent("booking", "send-confirmation", "Sent a booking confirmation by email");
            }, (err: any) => { });
        }).catch((err: any) => { });
    }
}