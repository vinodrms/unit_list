import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {ConfigCapacityComponent} from '../../../../../../../../../../../common/utils/components/ConfigCapacityComponent';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {BookingCartItemVM} from '../../../../services/search/view-models/BookingCartItemVM';

@Component({
    selector: 'booking-details-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-fill-details/components/template/booking-details-editor.html',
    directives: [ConfigCapacityComponent],
    pipes: [TranslationPipe]
})
export class BookingDetailsEditorComponent extends BaseComponent {
    private _bookingCartItem: BookingCartItemVM;
    public get bookingCartItem(): BookingCartItemVM {
        return this._bookingCartItem;
    }
    @Input()
    public set bookingCartItem(bookingCartItem: BookingCartItemVM) {
        if (!bookingCartItem) {
            return;
        }
        this._bookingCartItem = bookingCartItem;
        this.updateDependentData();
    }

    intervalString: string;
    noOfNights: number;
    madeThroughAllotment: boolean;

    constructor(private _appContext: AppContext) {
        super();
    }

    private updateDependentData() {
        this.intervalString = this._bookingCartItem.bookingInterval.getLongDisplayString(this._appContext.thTranslation);
        this.noOfNights = this._bookingCartItem.bookingInterval.getNumberOfDays();
        this.madeThroughAllotment = true;
        if (this._appContext.thUtils.isUndefinedOrNull(this._bookingCartItem.transientBookingItem.allotmentId)) {
            this.madeThroughAllotment = false;
        }
        // TODO
        // this._bookingCartItem.bookingCapacity
    }

}