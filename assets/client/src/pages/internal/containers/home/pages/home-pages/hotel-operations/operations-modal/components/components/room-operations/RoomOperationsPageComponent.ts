import {Component, Input, OnInit} from '@angular/core';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {RoomVM} from '../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomAttachedBookingResultDO} from '../../../../../../../../../services/hotel-operations/room/data-objects/RoomAttachedBookingResultDO';
import {HotelRoomOperationsPageParam} from './services/utils/HotelRoomOperationsPageParam';
import {RoomOperationsPageService} from './services/RoomOperationsPageService';
import {RoomOperationsPageData} from './services/utils/RoomOperationsPageData';

@Component({
    selector: 'room-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/room-operations/template/room-operations-page.html',
    providers: [RoomOperationsPageService]
})
export class RoomOperationsPageComponent implements OnInit {
    @Input() roomOperationsPageParam: HotelRoomOperationsPageParam;

    private _roomOperationsPageData: RoomOperationsPageData;

    constructor(private _appContext: AppContext,
        private _roomOperationsPageService: RoomOperationsPageService) { }

    public ngOnInit() {
        this._roomOperationsPageService.getPageData(this.roomOperationsPageParam).subscribe((pageData: RoomOperationsPageData) => {
            this._roomOperationsPageData = pageData;
        }, (err: ThError) => {
            this._appContext.toaster.error(err.message);
        });
    }

    public get roomVM(): RoomVM {
        return this._roomOperationsPageData.roomVM;
    }
    public get attachedBookingResult(): RoomAttachedBookingResultDO {
        return this._roomOperationsPageData.attachedBookingResult;
    }
}