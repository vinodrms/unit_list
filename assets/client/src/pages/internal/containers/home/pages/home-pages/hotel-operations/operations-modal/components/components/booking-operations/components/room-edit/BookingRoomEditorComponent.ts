import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingAssignRoomRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {HotelOperationsPageControllerService} from '../../../../services/HotelOperationsPageControllerService';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {AssignRoomModalService} from '../../../../../../assign-room/services/AssignRoomModalService';
import {AssignRoomParam} from '../../../../../../assign-room/services/utils/AssignRoomParam';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';

@Component({
    selector: 'booking-room-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/room-edit/template/booking-room-editor.html',
    providers: [AssignRoomModalService],
    pipes: [TranslationPipe]
})
export class BookingRoomEditorComponent {
    @Output() onBookingRoomChanged = new EventEmitter<BookingDO>();
    public triggerOnBookingRoomChanged(updatedBooking: BookingDO) {
        this.onBookingRoomChanged.next(updatedBooking);
    }
    @Input() public bookingOperationsPageData: BookingOperationsPageData;

    constructor(private _appContext: AppContext,
        private _operationsPageControllerService: HotelOperationsPageControllerService,
        private _assignRoomModalService: AssignRoomModalService) { }

    public get bookingDO(): BookingDO {
        return this.bookingOperationsPageData.bookingDO;
    }
    public get roomVM(): RoomVM {
        return this.bookingOperationsPageData.roomVM;
    }

    public get hasAttachedRoom(): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(this.roomVM)
            && !this._appContext.thUtils.isUndefinedOrNull(this.roomVM.room);
    }

    public get changeEditRight(): boolean {
        return this.bookingOperationsPageData.bookingMeta.assignRoomRight === BookingAssignRoomRight.Change;
    }
    public get reserveEditRight(): boolean {
        return this.bookingOperationsPageData.bookingMeta.assignRoomRight === BookingAssignRoomRight.Reserve;
    }
    public get hasEditRight(): boolean {
        return this.changeEditRight || this.reserveEditRight;
    }

    public get buttonText() {
        if (this.changeEditRight) { return "Change"; }
        if (this.reserveEditRight) { return "Reserve"; }
        return "";
    }

    public goToRoom() {
        if (!this.hasAttachedRoom) { return; }
        this._operationsPageControllerService.goToRoom(this.roomVM.room.id);
    }

    public assignRoom() {
        if (!this.hasEditRight) { return; }
        this.getAssignRoomModalPromise().then((modalDialogRef: ModalDialogRef<BookingDO>) => {
            modalDialogRef.resultObservable
                .subscribe((updatedBooking: BookingDO) => {
                    this.triggerOnBookingRoomChanged(updatedBooking);
                }, (err: any) => {
                    console.log(err)
                });
        }).catch((err: any) => { });
    }
    private getAssignRoomModalPromise(): Promise<ModalDialogRef<BookingDO>> {
        if (this.changeEditRight) { return this._assignRoomModalService.changeRoom(this.assignRoomParam); }
        return this._assignRoomModalService.reserveRoom(this.assignRoomParam);
    }
    private get assignRoomParam(): AssignRoomParam {
        return {
            groupBookingId: this.bookingDO.groupBookingId,
            bookingId: this.bookingDO.bookingId
        }
    }
}