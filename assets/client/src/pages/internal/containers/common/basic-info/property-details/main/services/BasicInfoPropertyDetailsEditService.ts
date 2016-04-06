import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi, ThError} from '../../../../../../../../common/utils/AppContext';

import {HotelAmenityVMContainer} from './utils/HotelAmenityVMContainer';
import {HotelDO} from '../../../../../../services/hotel/data-objects/hotel/HotelDO';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {ThHourDO} from '../../../../../../services/common/data-objects/th-dates/ThHourDO';
import {HotelDetailsDO} from '../../../../../../services/hotel/data-objects/HotelDetailsDO';
import {TimezoneDO} from '../../../../../../services/timezones/data-objects/TimezoneDO';

@Injectable()
export class BasicInfoPropertyDetailsEditService {
    public didSubmitForm: boolean = false;

    private _hotelAmenities: HotelAmenityVMContainer;
    private _hotel: HotelDO;

    constructor(private _appContext: AppContext,
        private _hotelService: HotelService) {
    }
    
    public bootstrap(hotelAmenities: HotelAmenityVMContainer, hotel: HotelDO) {
		this._hotelAmenities = hotelAmenities;
		this._hotel = hotel;
	}
    
    public updateTimezone(timezone: string) {
	    this._hotel.timezone = timezone;        	
	}
    
    public updateCheckInFrom(checkInFromHour: ThHourDO) {
		this._hotel.operationHours.checkInFrom = checkInFromHour;
	}
    
    public updateCheckInTo(checkInToHour: ThHourDO) {
		this._hotel.operationHours.checkInToOptional = checkInToHour;
	}
    
    public updateCheckOutFrom(checkOutFromHour: ThHourDO) {
		this._hotel.operationHours.checkOutFromOptional = checkOutFromHour;
	}
    
    public updateCheckOutTo(checkOutToHour: ThHourDO) {
		this._hotel.operationHours.checkOutTo = checkOutToHour;
	}
    
    public updateCancellationHour(cancellationHour: ThHourDO) {
        this._hotel.operationHours.cancellationHour = cancellationHour;
    }
    
    private isValid() {
		return this._hotel.timezone && this._hotel.operationHours.checkInFrom.isValid() && this._hotel.operationHours.checkOutTo.isValid() && this._hotel.operationHours.cancellationHour.isValid();
	}
    
    public savePropertyDetails(): Observable<any> {
		this.didSubmitForm = true;

		if (!this.isValid()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return this.reject();
		}
		this._hotel.amenityIdList = this._hotelAmenities.getSelectedHotelAmenityList();

		return new Observable<any>((observer: Observer<any>) => {
			this._hotelService.updatePropertyDetails(this._hotel).subscribe((hotel: HotelDetailsDO) => {
				observer.next(hotel);
				observer.complete();
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
				observer.error(error);
				observer.complete();
			});
		});
	}
    
    private reject(): Observable<any> {
		return new Observable((serviceObserver: Observer<any>) => {
			serviceObserver.error(true);
			serviceObserver.complete();
		});
	}
}