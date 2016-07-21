import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {HotelOperationsComponent} from './components/HotelOperationsComponent';
import {HotelOperationsModalResult} from './services/utils/HotelOperationsModalResult';

@Component({
    selector: 'hotel-operations-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/template/hotel-operations-modal.html',
    directives: [HotelOperationsComponent]
})
export class HotelOperationsModalComponent extends BaseComponent implements ICustomModalComponent {
    private _hotelOperationsModalResult: HotelOperationsModalResult;

    constructor(private _modalDialogRef: ModalDialogRef<HotelOperationsModalResult>) {
        super();
        this._hotelOperationsModalResult = new HotelOperationsModalResult();
    }

    public isBlocking(): boolean {
        return true;
    }
    public getSize(): ModalSize {
        return ModalSize.XLarge;
    }

    public markRoomChange() {
        this._hotelOperationsModalResult.didChangeRoom = true;
    }
    public markBookingChange() {
        this._hotelOperationsModalResult.didChangeBooking = true;
    }
    public markInvoiceChange() {
        this._hotelOperationsModalResult.didChangeInvoice = true;
    }
    public closeOperationsModal() {
        this._modalDialogRef.addResult(this._hotelOperationsModalResult);
        this._modalDialogRef.closeForced();
    }
}