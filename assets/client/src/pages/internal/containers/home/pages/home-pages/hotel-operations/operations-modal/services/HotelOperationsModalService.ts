import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {HotelOperationsModalComponent} from '../HotelOperationsModalComponent';
import {HotelOperationsModalResult} from './utils/HotelOperationsModalResult';
import {IHotelOperationsPageParam} from './utils/IHotelOperationsPageParam';
import {HotelRoomOperationsPageParam} from '../components/components/room-operations/services/utils/HotelRoomOperationsPageParam';
import {HotelBookingOperationsPageParam} from '../components/components/booking-operations/services/utils/HotelBookingOperationsPageParam';
import {HotelCustomerOperationsPageParam} from '../components/components/customer-operations/services/utils/HotelCustomerOperationsPageParam';

@Injectable()
export class HotelOperationsModalService {
    constructor(private _appContext: AppContext) { }

    public openRoomOperationsModal(roomId: string): Promise<ModalDialogRef<HotelOperationsModalResult>> {
        var roomOperationsParam = new HotelRoomOperationsPageParam();
        roomOperationsParam.roomId = roomId;
        return this.openOperationsModal(roomOperationsParam);
    }

    public openBookingOperationsModal(groupBookingId: string, bookingId: string): Promise<ModalDialogRef<HotelOperationsModalResult>> {
        var bookingOperationsPageParam = new HotelBookingOperationsPageParam();
        bookingOperationsPageParam.groupBookingId = groupBookingId;
        bookingOperationsPageParam.bookingId = bookingId;
        return this.openOperationsModal(bookingOperationsPageParam);
    }

    public openCustomerOperationsModal(customerId: string): Promise<ModalDialogRef<HotelOperationsModalResult>> {
        var custOperationsPageParam = new HotelCustomerOperationsPageParam();
        custOperationsPageParam.customerId = customerId;
        return this.openOperationsModal(custOperationsPageParam);
    }

    private openOperationsModal(pageParam: IHotelOperationsPageParam): Promise<ModalDialogRef<HotelOperationsModalResult>> {
        return this._appContext.modalService.open<HotelOperationsModalResult>(<any>HotelOperationsModalComponent, ReflectiveInjector.resolve([
            provide(IHotelOperationsPageParam, { useValue: pageParam })
        ]));
    }
}