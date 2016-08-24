import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {HotelOperationsModalComponent} from '../HotelOperationsModalComponent';
import {HotelOperationsResult} from './utils/HotelOperationsResult';
import {IHotelOperationsPageParam} from './utils/IHotelOperationsPageParam';
import {HotelRoomOperationsPageParam} from '../components/components/room-operations/utils/HotelRoomOperationsPageParam';
import {HotelBookingOperationsPageParam} from '../components/components/booking-operations/utils/HotelBookingOperationsPageParam';
import {HotelCustomerOperationsPageParam} from '../components/components/customer-operations/utils/HotelCustomerOperationsPageParam';
import {HotelInvoiceOperationsPageParam} from '../components/components/invoice-operations/utils/HotelInvoiceOperationsPageParam';

@Injectable()
export class HotelOperationsModalService {
    constructor(private _appContext: AppContext) { }

    public openRoomOperationsModal(roomId: string): Promise<ModalDialogRef<HotelOperationsResult>> {
        var roomOperationsParam = new HotelRoomOperationsPageParam(roomId);
        return this.openOperationsModal(roomOperationsParam);
    }

    public openBookingOperationsModal(groupBookingId: string, bookingId: string): Promise<ModalDialogRef<HotelOperationsResult>> {
        var bookingOperationsPageParam = new HotelBookingOperationsPageParam(groupBookingId, bookingId);
        return this.openOperationsModal(bookingOperationsPageParam);
    }

    public openCustomerOperationsModal(customerId: string): Promise<ModalDialogRef<HotelOperationsResult>> {
        var custOperationsPageParam = new HotelCustomerOperationsPageParam(customerId);
        return this.openOperationsModal(custOperationsPageParam);
    }

    public openInvoiceGroupOperationsModal(invoiceGroupId: string, customerId: string): Promise<ModalDialogRef<HotelOperationsResult>> {
        var invoiceOperationsPageParam = new HotelInvoiceOperationsPageParam(invoiceGroupId, {customerId: customerId}, false);
        return this.openOperationsModal(invoiceOperationsPageParam);
    }

    private openOperationsModal(pageParam: IHotelOperationsPageParam): Promise<ModalDialogRef<HotelOperationsResult>> {
        return this._appContext.modalService.open<HotelOperationsResult>(<any>HotelOperationsModalComponent, ReflectiveInjector.resolve([
            provide(IHotelOperationsPageParam, { useValue: pageParam })
        ]));
    }
}