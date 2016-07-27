import {Component, Input, Output, NgZone, ElementRef, EventEmitter} from '@angular/core';

import {ArrivalItemInfoVM} from '../../../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';
import {ArrivalItemStatus} from '../../../../../../../../../../services/hotel-operations/dashboard/arrivals/data-objects/ArrivalItemInfoDO';

import {HotelDashboardModalService} from '../../../../services/HotelDashboardModalService';

declare var $: any;
@Component({
	selector: 'arrival-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/arrivals-pane/components/arrival-item/template/arrival-item.html'
})

export class ArrivalItemComponent {
	public enums;

	@Input() arrivalItemVM: ArrivalItemInfoVM;
	@Output() startedDragging = new EventEmitter();
	@Output() stoppedDragging = new EventEmitter();

	constructor(
		private _zone: NgZone,
		private _root: ElementRef,
		private _modalService: HotelDashboardModalService
		) {
		
		this.enums = {
			ArrivalItemStatus: ArrivalItemStatus
		};
	}

	ngAfterViewInit() {
		$(this._root.nativeElement).draggable(
            {
                revert:     'invalid',
				cursorAt: { left: 12 , bottom: 6 },
				helper: () => {
					var helperHtml = `
					<arrival-helper class=" flex-row">
						<div class="left p-6 orange">
							<i class="fa fa-ellipsis-v"></i>
						</div>
						<div class="right flex-row flex-jc-sb p-6">
							<div class="client-name">`
								+ this.arrivalItemVM.customerName +
							`</div>
							<div class="other-details gray-color f-12">
								<div>
									<span class="unitpal-font f-12">(</span> ` + this.arrivalItemVM.numberOfPeople + 
									` <span class="unitpal-font f-12">Y</span> `+ this.arrivalItemVM.numberOfNights +
							`	</div>
							</div>
						</div>
					</arrival-helper>
				`

					return $(helperHtml);
				},
				zIndex:     100,
				start: (event, ui) =>{
					this._zone.run(() => {
						this.startedDragging.emit(this.arrivalItemVM);
					});
				},
				stop: (event, ui) => {
					this._zone.run(() => {
						this.stoppedDragging.emit(this.arrivalItemVM);
					});
				}
            }
		);
	}

	public openCustomerModal(){
		var customerId = this.arrivalItemVM.arrivalItemDO.customerId;
		this._modalService.openCustomerModal(customerId);
	}

	public openBookingModal(){
		var bookingId = this.arrivalItemVM.arrivalItemDO.bookingId;
		var groupBookingId = this.arrivalItemVM.arrivalItemDO.groupBookingId;
		this._modalService.openBookingModal(bookingId, groupBookingId);
	}

	public openCheckInModal(){
		var bookingId = this.arrivalItemVM.arrivalItemDO.bookingId;
		var groupBookingId = this.arrivalItemVM.arrivalItemDO.groupBookingId;
		this._modalService.openCheckInModal(bookingId, groupBookingId);
	}
}