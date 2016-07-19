import {ThDateDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThTranslation} from '../../../../../../../../../common/utils/localization/ThTranslation';

import {ThDateIntervalDO} from '../../../../../../../../internal/services/common/data-objects/th-dates/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../../../../internal/services/common/data-objects/bed-config/ConfigCapacityDO';

export class DepartureItemVM {
    private _clientName : string;
    private _roomName : string;
    private _interval : ThDateIntervalDO;
    private _config : ConfigCapacityDO;

    constructor(private _thTranslation: ThTranslation) {

    }

    public get clientName() : string {
        return this._clientName;
    }

    public set clientName(v : string) {
        this._clientName = v;
    }

    public get roomName() : string {
        return this._roomName;
    }

    public set roomName(v : string) {
        this._roomName = v;
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