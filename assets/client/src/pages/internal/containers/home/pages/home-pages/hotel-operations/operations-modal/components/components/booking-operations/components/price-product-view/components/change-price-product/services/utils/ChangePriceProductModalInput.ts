import { BookingDO } from '../../../../../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { CustomersDO } from '../../../../../../../../../../../../../../../services/customers/data-objects/CustomersDO';

export class ChangePriceProductModalInput {
    private _booking: BookingDO;
    private _customersContainer: CustomersDO;

    constructor(booking: BookingDO, customersContainer: CustomersDO) {
        this._booking = booking;
        this._customersContainer = customersContainer;
    }

    public get booking(): BookingDO {
        return this._booking;
    }
    public set booking(booking: BookingDO) {
        this._booking = booking;
    }

    public get customersContainer(): CustomersDO {
        return this._customersContainer;
    }
    public set customersContainer(customersContainer: CustomersDO) {
        this._customersContainer = customersContainer;
    }
}