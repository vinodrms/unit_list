import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {EditSaveButtonGroupComponent} from '../../../../../../../../../../../../../common/utils/components/button-groups/EditSaveButtonGroupComponent';
import {FileAttachmentsComponent} from '../../../../../../../../../../../../../common/utils/components/file-attachments/FileAttachmentsComponent';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingDetailsEditRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {FileAttachmentDO} from '../../../../../../../../../../../services/common/data-objects/file/FileAttachmentDO';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';

@Component({
    selector: 'booking-details-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/booking-details/template/booking-details-editor.html',
    directives: [EditSaveButtonGroupComponent, FileAttachmentsComponent],
    pipes: [TranslationPipe]
})
export class BookingDetailsEditorComponent implements OnInit {
    @Output() onBookingDetailsChanged = new EventEmitter<BookingDO>();
    public triggerOnBookingDetailsChanged(updatedBooking: BookingDO) {
        this.onBookingDetailsChanged.next(updatedBooking);
    }

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
    readonly: boolean = true;
    isSaving: boolean = false;

    private _notesCopy: string;
    private _fileAttachmentListCopy: FileAttachmentDO[];

    constructor(private _appContext: AppContext,
        private _hotelOperationsBookingService: HotelOperationsBookingService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.readonly = true;
        this.isSaving = false;
    }
    public get bookingDO(): BookingDO {
        return this._bookingOperationsPageData.bookingDO;
    }
    public get notesAreEmpty(): boolean {
        return this._appContext.thUtils.isUndefinedOrNull(this.bookingDO.notes) || this.bookingDO.notes.length == 0;
    }
    public get fileAttachmentsListIsEmpty(): boolean {
        return this.bookingDO.fileAttachmentList.length == 0;
    }
    public get hasDetailsEditRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.detailsEditRight === BookingDetailsEditRight.Edit;
    }

    public startEdit() {
        if (!this.hasDetailsEditRight) { return; };
        this.readonly = false;
        this._notesCopy = this.bookingDO.notes;
        this._fileAttachmentListCopy = _.map(this.bookingDO.fileAttachmentList, (attachment: FileAttachmentDO) => { return attachment });
    }
    public didChangeFileAttachmentList(fileAttachmentList: FileAttachmentDO[]) {
        this.bookingDO.fileAttachmentList = fileAttachmentList;
    }
    public endEdit() {
        this.readonly = true;
        this.bookingDO.notes = this._notesCopy;
        this.bookingDO.fileAttachmentList = this._fileAttachmentListCopy;
    }
    public saveBookingDetails() {
        if (!this.hasDetailsEditRight) {
            this.endEdit();
            return;
        }
        this.isSaving = true;
        this._hotelOperationsBookingService.changeDetails(this.bookingDO).subscribe((updatedBooking: BookingDO) => {
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnBookingDetailsChanged(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}