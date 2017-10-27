import {ThDateDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThTranslation} from '../../../../../../../../../common/utils/localization/ThTranslation';

import {ThDateIntervalDO} from '../../../../../../../../internal/services/common/data-objects/th-dates/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../../../../internal/services/common/data-objects/bed-config/ConfigCapacityDO';


import {RoomStatusType} from '../shared/RoomStatusType';

export class RoomStatus{
    private _value : string;

    constructor(private _thTranslation : ThTranslation) {
    }

    public get value() : string {
        return this._value;
    }

    public set value(v : string) {
        this._value = v;
    }

    public get displayName() : string {
        return this._value;
    }
}

export class RoomCategory{
    constructor(private _thTranslation : ThTranslation) {
    }

    private _value : string;
    public get value() : string {
        return this._value;
    }

    public set value(v : string) {
        this._value = v;
    }

    
    public get displayName() : string {
        return this._value;
    }
}


export class RoomBooking{
    constructor(private _thTranslation : ThTranslation) {
    }

    private _clientName : string;
    private _clientId : string;
    private _interval : ThDateIntervalDO;
    private _config : ConfigCapacityDO;

    public get clientId() : string {
        return this._clientId;
    }

    public set clientId(v : string) {
        this._clientId = v;
    }

    public get clientName() : string {
        return this._clientName;
    }

    public set clientName(v : string) {
        this._clientName = v;
    }

    public get interval() : ThDateIntervalDO {
        return this._interval;
    }

    public set interval(v : ThDateIntervalDO) {
        this._interval = v;
    }

    public get config() : ConfigCapacityDO {
        return this._config;
    }

    public set config(v : ConfigCapacityDO) {
        this._config = v;
    }
    
    public get numberOfPeople() : number {
        //TODO: "Needs more polished implementation"
        return this._config.noAdults + this._config.noChildren;
    }
    
    public get numberOfNights() : number {
        return this._interval.getNumberOfDays();
    }

    public get arrivalLabel() : string {
        return this._interval.start.getShortDisplayString(this._thTranslation);
    }
    
    public get departureLabel() : string {
        return this._interval.end.getShortDisplayString(this._thTranslation);
    }
}

export class RoomProperties{
    private _name : string;
    private _booking : RoomBooking;
    private _maintenanceStatus : string;
 
    constructor(private _thTranslation : ThTranslation) {
        this._booking = new RoomBooking(this._thTranslation);
    }

    public get name() : string {
        return this._name;
    }

    public set name(v : string) {
        this._name = v;
    }
    
    public get maintenanceStatus() : string {
        return this._maintenanceStatus;
    }
    public set maintenanceStatus(v : string) {
        this._maintenanceStatus = v;
    }
    

    public get booking() : RoomBooking {
        return this._booking;
    }

    public set booking(v : RoomBooking) {
        this._booking = v;
    }
    
}

export class RoomCardVM {
    private _status : RoomStatus;
    private _roomCategory : RoomCategory;
    private _properties : RoomProperties;

    constructor(private _thTranslation : ThTranslation) {
        this._status = new RoomStatus(this._thTranslation);
        this._roomCategory = new RoomCategory(this._thTranslation);
        this._properties = new RoomProperties(this._thTranslation);
    }


    public get status() : RoomStatus {
        return this._status;
    }

    public set status(v : RoomStatus) {
        this._status = v;
    }

    public get roomCategory() : RoomCategory {
        return this._roomCategory;
    }

    public set roomCategory(v : RoomCategory) {
        this._roomCategory = v;
    }
    
    public get properties() : RoomProperties {
        return this._properties;
    }

    public set properties(v : RoomProperties) {
        this._properties = v;
    }
    
}