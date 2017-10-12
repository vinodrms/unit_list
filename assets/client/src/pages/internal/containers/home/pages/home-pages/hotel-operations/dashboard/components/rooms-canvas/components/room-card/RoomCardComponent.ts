import { Component, Input, Output, NgZone, ElementRef, EventEmitter } from '@angular/core';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { AppContext } from '../../../../../../../../../../../../common/utils/AppContext';
import { ModalDialogRef } from '../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { RoomItemInfoVM } from '../../../../../../../../../../services/hotel-operations/dashboard/rooms/view-models/RoomItemInfoVM';
import { RoomDropHandlerFactory } from './drop-handlers/RoomDropHandlerFactory';
import { RoomMaintenanceStatus, RollawayBedStatus } from '../../../../../../../../../../services/rooms/data-objects/RoomDO';
import { ArrivalItemInfoVM } from '../../../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';
import { HotelOperationsResult } from '../../../../../operations-modal/services/utils/HotelOperationsResult';
import { HotelOperationsModalService } from '../../../../../operations-modal/services/HotelOperationsModalService';
import { AssignRoomParam } from '../../../../../../../../../../services/hotel-operations/room/utils/AssignRoomParam';
import { HotelOperationsDashboardService } from '../../../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';
import { HotelOperationsRoomService } from '../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import { RoomsCanvasComponent } from '../../../rooms-canvas/RoomsCanvasComponent';
import { HotelDashboardModalService } from '../../../../services/HotelDashboardModalService';
import { RoomMaintenanceStatusModalService } from './modal/services/RoomMaintenanceStatusModalService';

declare var $: any;

@Component({
    selector: 'room-card',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/rooms-canvas/components/room-card/template/room-card.html',
    providers: [RoomMaintenanceStatusModalService]
})
export class RoomCardComponent {
    public maintenance;
    public enums;
    @Input() roomCanvas: RoomsCanvasComponent;
    @Input() roomVM: RoomItemInfoVM;
    @Output() dropped = new EventEmitter();

    constructor(
        private _zone: NgZone,
        private _root: ElementRef,
        private _operationRoomService: HotelOperationsRoomService,
        private _hotelOperationsDashboardService: HotelOperationsDashboardService,
        private _hotelOperationsModalService: HotelOperationsModalService,
        private _modalService: HotelDashboardModalService,
        private _appContext: AppContext,
        private _roomMaintenanceStatusModalService: RoomMaintenanceStatusModalService
    ) {

        this.enums = {
            RoomMaintenanceStatus: RoomMaintenanceStatus
        }

        this.maintenance = undefined;
    }

    private buildMaintenanceObject(status: RoomMaintenanceStatus) {
        switch (status) {
            case RoomMaintenanceStatus.Dirty:
                this.maintenance = {
                    cssClass: 'orange-color',
                    title: 'Dirty',
                    icon: 'H',
                    clickHandler: () => {
                        this.openRoomMaintenanceStatusModal();
                    }
                }
                break;

            case RoomMaintenanceStatus.PickUp:
                this.maintenance = {
                    cssClass: 'orange-color',
                    title: 'Pickup',
                    icon: 'J',
                    clickHandler: () => {
                        this.openRoomMaintenanceStatusModal();
                    }
                }
                break;

            case RoomMaintenanceStatus.OutOfOrder:
                this.maintenance = {
                    cssClass: 'orange-color',
                    title: 'Out of order',
                    icon: '+',
                    clickHandler: () => {
                        this.openRoomMaintenanceStatusModal();
                    }
                }
                break;

            case RoomMaintenanceStatus.OutOfService:
                this.maintenance = {
                    cssClass: 'orange-color',
                    title: 'Out of service',
                    icon: 'K',
                    clickHandler: () => {
                        this.openRoomMaintenanceStatusModal();
                    }
                }
                break;

            default:
                this.maintenance = undefined;
                break;
        }
    }

    ngOnInit() {
        this.buildMaintenanceObject(this.roomVM.maintenanceStatus);
    }

    public get needsRollawayBeds(): boolean {
        return (this.roomVM.isOccupied() || this.roomVM.isReserved()) &&
            !this._appContext.thUtils.isUndefinedOrNull(this.roomVM.roomItemDO.bookingCapacity) &&
            this.roomVM.roomVM.room.rollawayBedStatus === RollawayBedStatus.NoRollawayBeds &&
            !this.roomVM.canFitInStationaryCapacity(this.roomVM.roomItemDO.bookingCapacity);
    }
    public get hasRollawayBedsInside(): boolean {
        return this.roomVM.roomVM.room.rollawayBedStatus === RollawayBedStatus.RollawayBedsInside;
    }

    ngAfterViewInit() {
        $(this._root.nativeElement).find('.room-card').droppable(
            {
                hoverClass: () => {
                    var outcome = this.canDrop();
                    if (outcome.accepted) {
                        return "hover";
                    }
                    return ""
                },
                accept: () => {
                    return this.canDrop().accepted;
                },
                drop: (event: Event, ui: Object) => {
                    this._zone.run(() => {
                        var arrivalItem: ArrivalItemInfoVM = this.roomCanvas.getSelectedArrivalItem();
                        var outcome = this.canDrop();

                        if (outcome.accepted == true) {
                            if (this.roomVM.canCheckIn(arrivalItem)) {
                                var assignRoomParams: AssignRoomParam = {
                                    groupBookingId: arrivalItem.arrivalItemDO.groupBookingId,
                                    bookingId: arrivalItem.arrivalItemDO.bookingId,
                                    roomId: this.roomVM.roomVM.room.id,
                                    roomCategoryId: this.roomVM.roomVM.room.categoryId
                                };
                                if (this.roomVM.roomVM.room.maintenanceStatus != RoomMaintenanceStatus.Clean) {
                                    var roomNotCleanWarningString = this._appContext.thTranslation.translate('%roomName% is not clean. Are you sure you want to move the booking to this room?', {
                                        roomName: this.roomVM.roomVM.room.name
                                    });
                                    var roomNotCleanWarningTitle = this._appContext.thTranslation.translate('Warning');
                                    this._appContext.modalService.confirm(roomNotCleanWarningTitle, roomNotCleanWarningString, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
                                        () => {
                                            this._operationRoomService.checkIn(assignRoomParams).subscribe((r) => {
                                                this.dropped.emit(outcome);
                                            }, (e: any) => {
                                                this._appContext.toaster.error(e.message);
                                            })
                                        },
                                        () => {
                                            this.dropped.emit(outcome);
                                        });
                                } else {
                                    this._operationRoomService.checkIn(assignRoomParams).subscribe((r) => {
                                        this.dropped.emit(outcome);
                                    }, (e: any) => {
                                        this._appContext.toaster.error(e.message);
                                    })
                                }
                            }
                            else if (this.roomVM.canUpgrade(arrivalItem)) {
                                this.openCheckInModal(arrivalItem);
                            }
                        }
                        else {
                            this.dropped.emit(outcome)
                        }
                    })
                }
            }
        );
    }

    private canDrop(): { accepted: boolean, roomVM: RoomItemInfoVM } {
        var arrivalItem: ArrivalItemInfoVM = this.roomCanvas.getSelectedArrivalItem();
        var dropHandler = RoomDropHandlerFactory.get(this.roomVM);
        var outcome = {
            accepted: dropHandler.handle(arrivalItem),
            roomVM: this.roomVM
        }
        return outcome;
    }

    public openCustomerModal() {
        var customerId = this.roomVM.roomItemDO.customerId;
        this._modalService.openCustomerModal(customerId);
    }

    public openRoomModal() {
        var roomId = this.roomVM.roomItemDO.roomId;
        this._modalService.openRoomModal(roomId);
    }

    public openCheckInModal(arrivalItemVM: ArrivalItemInfoVM) {
        var bookingId = arrivalItemVM.arrivalItemDO.bookingId;
        var groupBookingId = arrivalItemVM.arrivalItemDO.groupBookingId;
        this._modalService.openCheckInModal(bookingId, groupBookingId, this.roomVM.roomItemDO.roomId);
    }

    public openBookingModal() {
        var bookingId = this.roomVM.roomItemDO.bookingId;
        this._modalService.openBookingModal(bookingId);
    }

    public openRoomMaintenanceStatusModal() {
        this._roomMaintenanceStatusModalService.openRoomMaintenanceStatusModal(this.roomVM.roomVM, this._operationRoomService);
    }
}
