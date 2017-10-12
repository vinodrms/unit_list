import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import { AppContext } from '../../../../../../../../../../../../common/utils/AppContext';
import { RoomsService } from '../../../../../../../../../../services/rooms/RoomsService';
import { RoomVM } from '../../../../../../../../../../services/rooms/view-models/RoomVM';
import { HotelOperationsRoomService } from '../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import { RoomAttachedBookingResultVM } from '../../../../../../../../../../services/hotel-operations/room/view-models/RoomAttachedBookingResultVM';
import { BedsEagerService } from '../../../../../../../../../../services/beds/BedsEagerService';
import { BedVM } from '../../../../../../../../../../services/beds/view-models/BedVM';
import { BedVMFilter } from '../../../../../../../../../../services/beds/utils/BedVMFilter';
import { RoomAmenitiesService } from '../../../../../../../../../../services/settings/RoomAmenitiesService';
import { RoomAttributesService } from '../../../../../../../../../../services/settings/RoomAttributesService';
import { RoomAmenitiesDO } from '../../../../../../../../../../services/settings/data-objects/RoomAmenitiesDO';
import { RoomAttributesDO } from '../../../../../../../../../../services/settings/data-objects/RoomAttributesDO';
import { HotelRoomOperationsPageParam } from '../utils/HotelRoomOperationsPageParam';
import { RoomOperationsPageData } from './utils/RoomOperationsPageData';
import { BookingDO } from '../../../../../../../../../../services/bookings/data-objects/BookingDO';

import * as _ from 'underscore';
import { HotelOperationsInvoiceService } from "../../../../../../../../../../services/hotel-operations/invoice/HotelOperationsInvoiceService";
import { InvoiceDO } from "../../../../../../../../../../services/invoices/data-objects/InvoiceDO";

@Injectable()
export class RoomOperationsPageService {

    constructor(private context: AppContext,
        private roomsService: RoomsService,
        private hotelOperationsRoomService: HotelOperationsRoomService,
        private bedsEagerService: BedsEagerService,
        private roomAmenitiesService: RoomAmenitiesService,
        private roomAttributesService: RoomAttributesService,
        private invoiceService: HotelOperationsInvoiceService) {
    }

    public getPageData(roomOperationsPageParams: HotelRoomOperationsPageParam): Observable<RoomOperationsPageData> {
        return Observable.combineLatest(
            this.roomsService.getRoomById(roomOperationsPageParams.roomId),
            this.bedsEagerService.getBedAggregatedList(),
            this.hotelOperationsRoomService.getAttachedBooking(roomOperationsPageParams.roomId),
            this.roomAmenitiesService.getRoomAmenitiesDO(),
            this.roomAttributesService.getRoomAttributesDO()
        ).map((result: [RoomVM, BedVM[], RoomAttachedBookingResultVM, RoomAmenitiesDO, RoomAttributesDO]) => {
            var roomVM: RoomVM = result[0];
            var bedVMList: BedVM[] = result[1];
            var roomAttachedBookingResultVM: RoomAttachedBookingResultVM = result[2];
            var bedVMFilter = new BedVMFilter(bedVMList);
            var filteredBedVMList = bedVMFilter.getFilteredBedsForRoomCategory(result[0].category);

            var roomOperationsData = new RoomOperationsPageData(roomVM, filteredBedVMList, roomAttachedBookingResultVM);
            roomOperationsData.allRoomAmenities = result[3];
            roomOperationsData.allRoomAttributes = result[4];
            return roomOperationsData;
        }).flatMap((roomOperationsData: RoomOperationsPageData) => {
            return this.attachInvoiceIfNecessaryOn(roomOperationsData);
        });
    }

    private attachInvoiceIfNecessaryOn(roomOperationsData: RoomOperationsPageData): Observable<RoomOperationsPageData> {
        if (!roomOperationsData.attachedBookingResultVM.roomAttachedBookingResultDO.hasCheckedInBooking()) {
            return Observable.from([roomOperationsData]);
        }
        var attachedBooking: BookingDO = roomOperationsData.attachedBookingResultVM.roomAttachedBookingResultDO.booking;
        if (this.context.thUtils.isUndefinedOrNull(attachedBooking)) {
            return Observable.from([roomOperationsData]);
        }
        return this.invoiceService.getDefaultInvoiceForBooking(attachedBooking.id)
            .map((invoice: InvoiceDO) => {
                roomOperationsData.invoiceDO = invoice;
                return roomOperationsData;
            });
    }
}
