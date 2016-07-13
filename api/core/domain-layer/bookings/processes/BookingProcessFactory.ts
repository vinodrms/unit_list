import {AppContext} from '../../../utils/AppContext';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {IBookingProcessStrategy} from './strategies/IBookingProcessStrategy';
import {MarkBookingsAsGuaranteedStategy} from './strategies/MarkBookingsAsGuaranteedStategy';
import {MarkBookingsAsNoShowStategy} from './strategies/MarkBookingsAsNoShowStategy';
import {IBookingStatusChangerProcess} from './IBookingStatusChangerProcess';
import {BookingStatusChangerProcess} from './BookingStatusChangerProcess';

export enum BookingStatusChangerProcessType {
    MarkBookingsAsGuaranteed,
    MarkBookingsAsNoShow
}

export class BookingProcessFactory {
    constructor(private _appContext: AppContext, private _hotel: HotelDO) {
    }

    public getBookingStatusChangerProcess(processType: BookingStatusChangerProcessType): IBookingStatusChangerProcess {
        var processStrategy = this.getBookingStrategy(processType);
        return new BookingStatusChangerProcess(this._appContext, this._hotel, processStrategy);
    }
    private getBookingStrategy(processType: BookingStatusChangerProcessType): IBookingProcessStrategy {
        switch (processType) {
            case BookingStatusChangerProcessType.MarkBookingsAsGuaranteed:
                return new MarkBookingsAsGuaranteedStategy();
            default:
                return new MarkBookingsAsNoShowStategy();
        }
    }
}