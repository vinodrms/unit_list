import {Component, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext} from '../../../../../../../../../../../../../common/utils/AppContext';
import {HotelOperationsPageControllerService} from '../../../../services/HotelOperationsPageControllerService';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';

@Component({
    selector: 'booking-links',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/booking-links/template/booking-links.html',
    pipes: [TranslationPipe]
})
export class BookingLinksComponent {
    @Input() bookingOperationsPageData: BookingOperationsPageData;

    constructor(private _appContext: AppContext,
        private _operationsPageControllerService: HotelOperationsPageControllerService) { }

    public get hasInvoice(): boolean {
        return this.bookingOperationsPageData.hasInvoice;
    }
    public get invoiceIsPaid(): boolean {
        return this.bookingOperationsPageData.invoiceDO.isPaid;
    }
    public viewInvoice() {
        if (!this.hasInvoice) { return; }
        this._operationsPageControllerService.goToInvoice(this.bookingOperationsPageData.invoiceGroupDO.id, {
            bookingId: this.bookingOperationsPageData.bookingDO.bookingId
        }, false);
    }

    public get hasRoom(): boolean {
        return this.bookingOperationsPageData.hasRoom;
    }
    public viewRoom() {
        if (!this.hasRoom) { return; }
        this._operationsPageControllerService.goToRoom(this.bookingOperationsPageData.bookingDO.roomId);
    }
}