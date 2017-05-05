import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { CustomerDO } from "../../../../data-layer/customers/data-objects/CustomerDO";
import { ThError } from "../../../../utils/th-responses/ThError";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../../utils/logging/ThLogger";

import _ = require('underscore');

export class BookingCustomers {
    private _meta;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._meta = { hotelId: this._sessionContext.sessionDO.hotel.id };
    }

    public getCompanyOrTAForGuest(booking: BookingDO): Promise<CustomerDO> {
        return new Promise<CustomerDO>((resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) => {
            this.getCompanyOrTAForGuestCore(resolve, reject, booking);
        });
    }

    private getCompanyOrTAForGuestCore(resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }, booking: BookingDO) {
        let customersRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
        customersRepo.getCustomerList(this._meta, { customerIdList: booking.customerIdList })
            .then(searchResult => {
                let companyOrTA = _.find(searchResult.customerList, (customer) => {
                    return customer.isCompanyOrTravelAgency();
                });
                resolve(companyOrTA);
            }).catch((error: any) => {
                let thError = new ThError(ThStatusCode.ReportsHKBookingCustomers, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error getting company/TA for guest", this._sessionContext, thError);
                }
                reject(thError);
            });
    }
}