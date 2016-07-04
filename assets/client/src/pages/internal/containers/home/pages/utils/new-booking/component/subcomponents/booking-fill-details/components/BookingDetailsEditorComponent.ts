import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {ConfigCapacityComponent} from '../../../../../../../../../../../common/utils/components/ConfigCapacityComponent';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {BookingCartItemVM} from '../../../../services/search/view-models/BookingCartItemVM';
import {BookingControllerService} from '../../utils/BookingControllerService';
import {CustomerDO} from '../../../../../../../../../services/customers/data-objects/CustomerDO';
import {IBookingCustomerRegisterSelector} from '../../utils/IBookingCustomerRegister';

@Component({
    selector: 'booking-details-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-fill-details/components/template/booking-details-editor.html',
    directives: [ConfigCapacityComponent],
    pipes: [TranslationPipe]
})
export class BookingDetailsEditorComponent extends BaseComponent {
    @Output() protected onBookingItemChanged = new EventEmitter<BookingCartItemVM>();

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

    private _customerRegisterSelector: IBookingCustomerRegisterSelector;

    intervalString: string;
    noOfNights: number;
    madeThroughAllotment: boolean;

    constructor(private _appContext: AppContext, private _bookingControllerService: BookingControllerService) {
        super();
        this._customerRegisterSelector = _bookingControllerService;
    }

    private updateDependentData() {
        this.intervalString = this._bookingCartItem.bookingInterval.getLongDisplayString(this._appContext.thTranslation);
        this.noOfNights = this._bookingCartItem.bookingInterval.getNumberOfDays();
        this.madeThroughAllotment = true;
        if (this._appContext.thUtils.isUndefinedOrNull(this._bookingCartItem.transientBookingItem.allotmentId)) {
            this.madeThroughAllotment = false;
        }
        this._bookingCartItem.customerList
    }
    public isBilledCustomer(customer: CustomerDO): boolean {
        return this._bookingCartItem.transientBookingItem.defaultBillingDetails.customerId === customer.id;
    }

    public addCustomer() {
        this._customerRegisterSelector.selectCustomerFromRegister().subscribe((selectedCustomer: CustomerDO) => {
            this._bookingCartItem.addCustomerIfNotExists(selectedCustomer);
            if (this._bookingCartItem.customerList.length == 1) {
                this.markBilledCustomer(selectedCustomer);
            }
            this.triggerBookingCartItemChange();
        });
    }
    public changeCustomer(previousCustomer: CustomerDO) {
        this._customerRegisterSelector.selectCustomerFromRegister().subscribe((selectedCustomer: CustomerDO) => {
            this._bookingCartItem.replaceCustomer(previousCustomer, selectedCustomer);
            if (this._bookingCartItem.transientBookingItem.defaultBillingDetails.customerId === previousCustomer.id) {
                this.markBilledCustomer(selectedCustomer);
            }
            this.triggerBookingCartItemChange();
        });
    }
    public markBilledCustomerFromTemplate(customer: CustomerDO) {
        this.markBilledCustomer(customer);
        this.triggerBookingCartItemChange();
    }
    private markBilledCustomer(customer: CustomerDO) {
        this._bookingCartItem.transientBookingItem.defaultBillingDetails.customerId = customer.id;
        this._bookingCartItem.customerNameString = customer.customerName;
    }

    private triggerBookingCartItemChange() {
        this.onBookingItemChanged.next(this._bookingCartItem);
    }
}