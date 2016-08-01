import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingSendConfirmationRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {EmailSenderModalService} from '../../../../../../email-sender/services/EmailSenderModalService';

@Component({
    selector: 'booking-send-confirmation',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/send-confirmation/template/booking-send-confirmation.html',
    providers: [EmailSenderModalService],
    pipes: [TranslationPipe]
})
export class BookingSendConfirmationComponent implements OnInit {
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
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
    }

    public get hasSendRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.sendConfirmationRight === BookingSendConfirmationRight.Send;
    }

    public send() {
        if (!this.hasSendRight) { return; }
        var customerList = this._bookingOperationsPageData.customersContainer.customerList;
        var groupBookingId = this._bookingOperationsPageData.bookingDO.groupBookingId;
        var bookingId = this._bookingOperationsPageData.bookingDO.bookingId;

        this._emailSenderModalService.sendBookingConfirmation(customerList, groupBookingId, bookingId).then((modalDialogRef: ModalDialogRef<boolean>) => {
            modalDialogRef.resultObservable.subscribe((sendResult: boolean) => {
            }, (err: any) => { });
        }).catch((err: any) => { });
    }
}