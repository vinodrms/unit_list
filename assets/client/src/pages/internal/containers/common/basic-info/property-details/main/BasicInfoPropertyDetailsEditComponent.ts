import { Component, OnInit } from 'angular2/core';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {HourPipe} from '../../../../../../../common/utils/pipes/HourPipe';
import {MinutePipe} from '../../../../../../../common/utils/pipes/MinutePipe';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import {LoadingComponent} from '../../../../../../../common/utils/components/LoadingComponent';
import {ThHourSelectComponent} from '../../../../../../../common/utils/components/th-hour-select/ThHourSelectComponent';
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
import {ThHourVM} from '../../../../../../../common/utils/components/th-hour-select/utils/ThHourVM';
import {BasicInfoPropertyDetailsEditService} from './services/BasicInfoPropertyDetailsEditService';

@Component({
    selector: 'basic-info-property-details-edit',
    templateUrl: '/client/src/pages/internal/containers/common/basic-info/property-details/main/template/basic-info-property-details-edit.html',
    directives: [LoadingComponent, ThHourSelectComponent],
    providers: [],
    pipes: [TranslationPipe, HourPipe, MinutePipe]
})
export class BasicInfoPropertyDetailsEditComponent extends BaseComponent implements OnInit {
    isLoading: boolean = true;

    timezoneList: TimezoneDO[];
    hotelAmenities: HotelAmenityVMContainer;
    hotel: HotelDO;

    operationHoursList: ThHourVM[];
    initialCheckInFromIndex: number;
    initialCheckInToIndex: number;
    initialCheckOutFromIndex: number;
    initialCheckOutToIndex: number;
    initialBookingCancellationHourIndex: number;
    
    amenities: number[] = [1, 2];
    
    constructor(private _appContext: AppContext,
        private _hotelAggregator: HotelAggregatorService,
        private _propertyDetailsEditService: BasicInfoPropertyDetailsEditService,
        private _timezoneService: TimezoneService) {
        super();
    }

    ngOnInit() {
        this.isLoading = true;

        Observable.zip(
            this._timezoneService.getTimezoneResponseDO(),
            this._hotelAggregator.getHotelAggregatedInfo()
        ).subscribe((result: [TimezoneResponseDO, HotelAggregatedInfo]) => {
            this.timezoneList = result[0].timezoneList;
            this.hotel = result[1].hotelDetails.hotel;
            this.hotelAmenities = new HotelAmenityVMContainer(result[1].hotelAmenities, this.hotel.amenityIdList);

            this.initDefaults();

            this._propertyDetailsEditService.bootstrap(this.hotelAmenities, this.hotel);

            this.isLoading = false;
        }, (error: ThError) => {
            this.isLoading = false;
            this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
        });
    }

    initDefaults() {
        this.operationHoursList = [];
        var index = 0;
        for (var i = ThHourDO.MinHourOfDay; i <= ThHourDO.MaxHourOfDay; i++) {
            var firstThHour: ThHourDO = new ThHourDO();
            firstThHour.hour = i;
            firstThHour.minute = 0;
            var secondThHour: ThHourDO = new ThHourDO();
            secondThHour.hour = i;
            secondThHour.minute = 30;

            this.operationHoursList.push(new ThHourVM(firstThHour, index++));
            this.operationHoursList.push(new ThHourVM(secondThHour, index++));
        }

        this.initialCheckInFromIndex = -1;
        this.initialCheckInToIndex = -1;
        this.initialCheckOutFromIndex = -1;
        this.initialCheckOutToIndex = -1;
        this.initialBookingCancellationHourIndex = -1;

        this.operationHoursList.forEach((thHourVM: ThHourVM) => {
            if (this.hotel.operationHours.checkInFrom && this.equalHours(thHourVM.thHour, this.hotel.operationHours.checkInFrom)) 
                this.initialCheckInFromIndex = thHourVM.index;
            if (this.hotel.operationHours.checkInToOptional && this.equalHours(thHourVM.thHour, this.hotel.operationHours.checkInToOptional)) 
                this.initialCheckInToIndex = thHourVM.index;
            if (this.hotel.operationHours.checkOutFromOptional && this.equalHours(thHourVM.thHour, this.hotel.operationHours.checkOutFromOptional)) 
                this.initialCheckOutFromIndex = thHourVM.index;
            if (this.hotel.operationHours.checkOutTo && this.equalHours(thHourVM.thHour, this.hotel.operationHours.checkOutTo)) 
                this.initialCheckOutToIndex = thHourVM.index;
            if (this.hotel.operationHours.cancellationHour && this.equalHours(thHourVM.thHour, this.hotel.operationHours.cancellationHour)) 
                this.initialBookingCancellationHourIndex = thHourVM.index;
        });
    }
    
    protected get didSubmitForm(): boolean {
		return this._propertyDetailsEditService.didSubmitForm;
	}
    
    protected displayTimezoneError(): boolean {
        return this.didSubmitForm && !this.hotel.timezone;
    }
    
    private equalHours(hour1: ThHourDO, hour2: ThHourDO): boolean {
        return hour1.hour === hour2.hour && hour1.minute === hour2.minute;
    }

    public updateTimezone(timezone: string) {
        this._propertyDetailsEditService.updateTimezone(timezone);
    }

    public diChangeCheckInFrom(checkInFromHour: ThHourDO) {
        this._propertyDetailsEditService.updateCheckInFrom(checkInFromHour);
    }

    public diChangeCheckInTo(checkInFromHour: ThHourDO) {
        this._propertyDetailsEditService.updateCheckInTo(checkInFromHour);
    }

    public diChangeCheckOutFrom(checkInFromHour: ThHourDO) {
        this._propertyDetailsEditService.updateCheckOutFrom(checkInFromHour);
    }

    public diChangeCheckOutTo(checkInFromHour: ThHourDO) {
        this._propertyDetailsEditService.updateCheckOutTo(checkInFromHour);
    }

    public diChangeCancellationHour(cancellationHour: ThHourDO) {
        this._propertyDetailsEditService.updateCancellationHour(cancellationHour);
    }
}