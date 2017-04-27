import { AppContext } from '../../../utils/AppContext';
import { SessionContext, SessionDO } from "../../../utils/SessionContext";
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { IBookingProcessStrategy } from './strategies/IBookingProcessStrategy';
import { MarkBookingsAsGuaranteedStategy } from './strategies/MarkBookingsAsGuaranteedStategy';
import { MarkBookingsAsNoShowStategy } from './strategies/MarkBookingsAsNoShowStategy';
import { IBookingStatusChangerProcess } from './IBookingStatusChangerProcess';
import { BookingStatusChangerProcess } from './BookingStatusChangerProcess';
import { Locales } from "../../../utils/localization/ThTranslation";

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
                return new MarkBookingsAsNoShowStategy(this._appContext, this.getSessionContext());
        }
    }
    private getSessionContext(): SessionContext {
        let ctx = new SessionContext();
        ctx.language = Locales.English;
        ctx.sessionDO = new SessionDO();
        ctx.sessionDO.hotel = {
            id: this._hotel.id
        };
        return ctx;
    }
}