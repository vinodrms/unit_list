import { Component, OnInit } from 'angular2/core';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {HourPipe} from '../../../../../../../common/utils/pipes/HourPipe';
import {MinutePipe} from '../../../../../../../common/utils/pipes/MinutePipe';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import {LoadingComponent} from '../../../../../../../common/utils/components/LoadingComponent';
import {HotelAggregatorService} from '../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../services/hotel/utils/HotelAggregatedInfo';
import {HotelDO} from '../../../../../services/hotel/data-objects/hotel/HotelDO';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {HotelAmenityVMContainer, HotelAmenityVM} from './services/utils/HotelAmenityVMContainer';
import {TimezoneService} from '../../../../../services/timezones/TimezoneService';
import {TimezoneResponseDO} from '../../../../../services/timezones//data-objects/TimezoneResponseDO';
import {TimezoneDO} from '../../../../../services/timezones//data-objects/TimezoneDO';
import {ThHourDO} from '../../../../../services/common/data-objects/th-dates/ThHourDO';
import {BasicInfoPropertyDetailsEditService} from './services/BasicInfoPropertyDetailsEditService';

@Component({
    selector: 'basic-info-property-details-edit',
    templateUrl: '/client/src/pages/internal/containers/common/basic-info/property-details/main/template/basic-info-property-details-edit.html',
    directives: [LoadingComponent],
    providers: [],
    pipes: [TranslationPipe, HourPipe, MinutePipe]
})
export class BasicInfoPropertyDetailsEditComponent extends BaseComponent implements OnInit {
    isLoading: boolean = true;
    
    operationHoursList: ThHourDO[];
    timezoneList: TimezoneDO[];
    hotelAmenities: HotelAmenityVMContainer;
    hotel: HotelDO;
    
    constructor(private _appContext: AppContext,
        private _hotelAggregator: HotelAggregatorService,
        private _propertyDetailsEditService: BasicInfoPropertyDetailsEditService,
        private _timezoneService: TimezoneService) {
        super();
    }

    ngOnInit() { 
        this.isLoading = true;
        
        this.initDefaults();
        
        Observable.zip(
            this._timezoneService.getTimezoneResponseDO(),
			this._hotelAggregator.getHotelAggregatedInfo()
		).subscribe((result: [TimezoneResponseDO, HotelAggregatedInfo]) => {
            this.timezoneList = result[0].timezoneList;
            this.hotel = result[1].hotelDetails.hotel;
            this.hotelAmenities = new HotelAmenityVMContainer(result[1].hotelAmenities, this.hotel.amenityIdList);
            this._propertyDetailsEditService.bootstrap(this.hotelAmenities, this.hotel);
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
    }
    
    private initDefaults() {
        this.operationHoursList = [];
        for(var i = ThHourDO.MinHourOfDay; i <= ThHourDO.MaxHourOfDay; i++) {
            var firstThHour: ThHourDO = new ThHourDO();
            firstThHour.hour = i;
            firstThHour.minute = 0;
            var secondThHour: ThHourDO = new ThHourDO();
            secondThHour.hour = i;
            secondThHour.minute = 30;
            
            this.operationHoursList.push(firstThHour);
            this.operationHoursList.push(secondThHour);
        }
            
    }
    
    public updateTimezone(timezone: TimezoneDO) {
        this._propertyDetailsEditService.updateTimezone(timezone);
	}
    
    public updateCheckInFrom(checkInFromHour: ThHourDO) {
		this._propertyDetailsEditService.updateCheckInFrom(checkInFromHour);
	}
    
    public updateCheckInTo(checkInToHour: ThHourDO) {
		this._propertyDetailsEditService.updateCheckInTo(checkInToHour);
	}
    
    public updateCheckOutFrom(checkOutFromHour: ThHourDO) {
		this._propertyDetailsEditService.updateCheckOutFrom(checkOutFromHour);
	}
    
    public updateCheckOutTo(checkOutToHour: ThHourDO) {
		this._propertyDetailsEditService.updateCheckOutTo(checkOutToHour);
	}
    
    public updateCancellationHour(cancellationHour: ThHourDO) {
        this._propertyDetailsEditService.updateCancellationHour(cancellationHour);
    }
}