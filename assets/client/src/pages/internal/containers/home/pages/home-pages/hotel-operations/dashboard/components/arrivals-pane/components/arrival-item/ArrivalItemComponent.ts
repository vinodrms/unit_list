import { Component, Input, Output, NgZone, ElementRef, EventEmitter } from '@angular/core';

import { ArrivalItemInfoVM } from '../../../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';
import { ArrivalItemStatus } from '../../../../../../../../../../services/hotel-operations/dashboard/arrivals/data-objects/ArrivalItemInfoDO';

import { HotelDashboardModalService } from '../../../../services/HotelDashboardModalService';
import { AppContext, ThError } from "../../../../../../../../../../../../common/utils/AppContext";
import { CheckInStrategy } from "../../../../../assign-room/services/strategies/CheckInStrategy";
import { HotelOperationsRoomService } from "../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService";
import { BookingDO } from "../../../../../../../../../../services/bookings/data-objects/BookingDO";
import { AssignRoomParam } from "../../../../../../../../../../services/hotel-operations/room/utils/AssignRoomParam";
import { HotelOperationsDashboardService } from "../../../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService";

declare var $: any;

@Component({
    selector: 'arrival-item',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/arrivals-pane/components/arrival-item/template/arrival-item.html',
    providers: [HotelOperationsRoomService]
})

export class ArrivalItemComponent {
    public enums;

    @Input() arrivalItemVM: ArrivalItemInfoVM;
    @Output() startedDragging = new EventEmitter();
    @Output() stoppedDragging = new EventEmitter();

    constructor(
        private zone: NgZone,
        private root: ElementRef,
        private hotelDashboardModalService: HotelDashboardModalService,
        private hotelOperationsRoomService: HotelOperationsRoomService,
        private hotelOperationsDashboardService: HotelOperationsDashboardService,
        private appContext: AppContext
    ) {

        this.enums = {
            ArrivalItemStatus: ArrivalItemStatus
        };
    }

    ngAfterViewInit() {
        if (this.arrivalItemVM.arrivalItemDO.itemStatus == ArrivalItemStatus.CanCheckIn) {
            $(this.root.nativeElement).find('.left').draggable(
                {
                    revert: 'invalid',
                    appendTo: 'arrivals-pane',
                    scroll: false,
                    cursorAt: { left: 12, bottom: 6 },
                    refreshPositions: true,
                    helper: () => {
                        var helperHtml = `
						<arrival-helper class="flex-row">
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
                            ` <span class="unitpal-font f-12">Y</span> ` + this.arrivalItemVM.numberOfNights +
                            `	</div>
								</div>
							</div>
						</arrival-helper>
					`

                        return $(helperHtml);
                    },
                    zIndex: 100,
                    start: (event, ui) => {
                        this.zone.run(() => {
                            $(this.root.nativeElement).addClass('ghost');
                            this.startedDragging.emit(this.arrivalItemVM);
                        });
                    },
                    stop: (event, ui) => {
                        this.zone.run(() => {
                            $(this.root.nativeElement).removeClass('ghost');
                            this.stoppedDragging.emit(this.arrivalItemVM);
                        });
                    }
                }
            );
        }
    }

    public openCustomerModal() {
        var customerId = this.arrivalItemVM.arrivalItemDO.customerId;
        this.hotelDashboardModalService.openCustomerModal(customerId);
    }

    public openCorporateCustomerModal() {
        var customerId = this.arrivalItemVM.arrivalItemDO.corporateCustomerId;
        this.hotelDashboardModalService.openCustomerModal(customerId);
    }

    public openBookingModal() {
        var bookingId = this.arrivalItemVM.arrivalItemDO.bookingId;
        this.hotelDashboardModalService.openBookingModal(bookingId);
    }

    public openCheckInModal() {
        var bookingId = this.arrivalItemVM.arrivalItemDO.bookingId;
        var groupBookingId = this.arrivalItemVM.arrivalItemDO.groupBookingId;
        this.hotelDashboardModalService.openCheckInModal(bookingId, groupBookingId);
    }

    public checkIn() {
        if (this.arrivalItemVM.hasReservedRoom) {
            var title = this.appContext.thTranslation.translate("Reserved Room Check-In");
            var content = this.appContext.thTranslation.translate("Are you sure you want to move the booking to %roomName%?", { roomName: this.arrivalItemVM.reservedRoomVM.room.name });
            this.appContext.modalService.confirm(title, content, {
                positive: this.appContext.thTranslation.translate("Yes"),
                negative: this.appContext.thTranslation.translate("No")
            }, () => {
                var checkInStrategy = new CheckInStrategy();
                var assignRoomParams: AssignRoomParam = {
                    groupBookingId: this.arrivalItemVM.arrivalItemDO.groupBookingId,
                    bookingId: this.arrivalItemVM.arrivalItemDO.bookingId,
                    roomId: this.arrivalItemVM.reservedRoomVM.room.id,
                    roomCategoryId: this.arrivalItemVM.reservedRoomVM.room.categoryId
                };
                checkInStrategy.applyStrategy(this.hotelOperationsRoomService, assignRoomParams).subscribe((updatedBooking: BookingDO) => {
                    this.hotelOperationsDashboardService.refreshArrivals();
                    this.hotelOperationsDashboardService.refreshRooms();
                }, (err: ThError) => {
                    this.appContext.toaster.error(err.message);
                    this.openCheckInModal();
                });
            }, () => { });
        } else {
            this.openCheckInModal();
        }
    }

    public openBookingNotesModal() {
        var bookingNotes = this.arrivalItemVM.arrivalItemDO.bookingNotes;
        this.hotelDashboardModalService.openBookingNotesModal(bookingNotes);
    }

    public openRoomModal() {
        if (this.arrivalItemVM.hasReservedRoom) {
            this.hotelDashboardModalService.openRoomModal(this.arrivalItemVM.reservedRoomVM.room.id);
        }
    }
}
