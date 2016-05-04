import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
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
    pipes: [TranslationPipe]
})
export class BasicInfoPropertyDetailsEditComponent extends BaseComponent implements OnInit {
    @Input() canAutoSave: boolean = false;
	isSaving: boolean = false;
    
    isLoading: boolean = true;

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

    public diChangeCheckInTo(checkInTo: ThHourDO) {
        this._propertyDetailsEditService.updateCheckInTo(checkInTo);
    }

    public diChangeCheckOutFrom(checkOutFrom: ThHourDO) {
        this._propertyDetailsEditService.updateCheckOutFrom(checkOutFrom);
    }

    public diChangeCheckOutTo(checkOutTo: ThHourDO) {
        this._propertyDetailsEditService.updateCheckOutTo(checkOutTo);
    }

    public diChangeCancellationHour(cancellationHour: ThHourDO) {
        this._propertyDetailsEditService.updateCancellationHour(cancellationHour);
    }
    savePropertyDetails() {
        this._propertyDetailsEditService.savePropertyDetails().subscribe((result: any) => {
			this.isSaving = false;
			this._appContext.toaster.success(this._appContext.thTranslation.translate("Information Saved Succesfully"));
		}, (error: any) => {
			this.isSaving = false;
		});
    }
}