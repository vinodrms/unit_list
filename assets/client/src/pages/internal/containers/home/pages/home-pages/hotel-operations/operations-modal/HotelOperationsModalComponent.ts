import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {HotelOperationsComponent} from './components/HotelOperationsComponent';
import {HotelOperationsResultService} from './services/HotelOperationsResultService';
import {HotelOperationsResult} from './services/utils/HotelOperationsResult';

@Component({
    selector: 'hotel-operations-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/template/hotel-operations-modal.html',
    directives: [HotelOperationsComponent],
    providers: [HotelOperationsResultService]
})
export class HotelOperationsModalComponent extends BaseComponent implements ICustomModalComponent {

    constructor(private _modalDialogRef: ModalDialogRef<HotelOperationsResult>,
        private _hotelOperationsResultService: HotelOperationsResultService) {
        super();
    }

    public isBlocking(): boolean {
        return true;
    }
    public getSize(): ModalSize {
        return ModalSize.XLarge;
    }

    public closeOperationsModal() {
        this._modalDialogRef.addResult(this._hotelOperationsResultService.hotelOperationsResult);
        this._modalDialogRef.closeForced();
    }
}