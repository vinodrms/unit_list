import {Injectable} from '@angular/core';
import {BookingDO} from '../../../../../../../services/bookings/data-objects/BookingDO';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {ArrivalItemInfoVM} from '../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';

import {AssignRoomModalService} from '../../assign-room/services/AssignRoomModalService';
import {HotelOperationsModalService} from '../../operations-modal/services/HotelOperationsModalService';

import {HotelOperationsResult} from '../../operations-modal/services/utils/HotelOperationsResult';
import {HotelOperationsDashboardService} from '../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';

@Injectable()
export class HotelDashboardModalService{
	constructor(private _assignRoomModalService : AssignRoomModalService,
		private _hotelOperationsModalService : HotelOperationsModalService,
		private _hotelOperationsDashboardService: HotelOperationsDashboardService){

		}

	public openCustomerModal(customerId:string){
		var  p = this._hotelOperationsModalService.openCustomerOperationsModal(customerId); 
		this.handleHotelOperationsModalPromise(p)
	}

	public openBookingModal(bookingId:string, groupBookingId:string){
		var  p = this._hotelOperationsModalService.openBookingOperationsModal(groupBookingId, bookingId); 
		this.handleHotelOperationsModalPromise(p)
	}

	public openRoomModal(roomId:string){
		var  p = this._hotelOperationsModalService.openRoomOperationsModal(roomId); 
		this.handleHotelOperationsModalPromise(p)
	}

	public openCheckInModal(bookingId:string, groupBookingId:string, roomId?:string){
		this._assignRoomModalService.checkIn({
			bookingId: bookingId,
			groupBookingId: groupBookingId,
			roomId : roomId
		}).then((modalDialogRef: ModalDialogRef<BookingDO>) => {
			modalDialogRef.resultObservable.subscribe((updatedBooking: BookingDO) => {
				this._hotelOperationsDashboardService.refreshArrivals();
				this._hotelOperationsDashboardService.refreshRooms();
			}, (err: any) => { });
		}).catch((err: any) => { });
	}

	private handleHotelOperationsModalPromise(modalPromise : Promise<ModalDialogRef<HotelOperationsResult>>) {
		modalPromise.then((modalDialogRef: ModalDialogRef<HotelOperationsResult>) => {
			modalDialogRef.resultObservable.subscribe((operationsResult: HotelOperationsResult) => {
				this.refreshObservablesIfNecessary(operationsResult);
			}, (err: any) => { });
		}).catch((err: any) => { });
	}

	private refreshObservablesIfNecessary(operationsResult: HotelOperationsResult){
		if (operationsResult.didSomethingChange){
			this._hotelOperationsDashboardService.refreshArrivals();
			this._hotelOperationsDashboardService.refreshRooms();
		}
	} 
}