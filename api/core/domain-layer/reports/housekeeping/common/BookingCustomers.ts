import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { CustomerDO } from "../../../../data-layer/customers/data-objects/CustomerDO";
import { ThError } from "../../../../utils/th-responses/ThError";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../../utils/logging/ThLogger";

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
        
        customersRepo.getCustomerById(this._meta, booking.displayCustomerId).then((displayCustomerDO: CustomerDO) => {
            if (displayCustomerDO.isIndividual) {
				let remainingCustomerIdList = _.without(booking.customerIdList, displayCustomerDO.id);
				if (remainingCustomerIdList.length > 0) {
					return customersRepo.getCustomerById(this._meta, remainingCustomerIdList[0]);
				}
                
                resolve(null);
			}
        }).then((customer: CustomerDO) => {
            if (customer.isCompanyOrTravelAgency) {
				resolve(customer);
			}
            resolve(null);
        }).catch((error: any) => {
			let thError = new ThError(ThStatusCode.ReportsHKBookingCustomers, error);
			if (thError.isNativeError()) {
				ThLogger.getInstance().logError(ThLogLevel.Error, "error getting company/TA for guest", this._sessionContext, thError);
			}
			reject(thError);
		});
    }
}