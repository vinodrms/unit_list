import {Component, Input, OnInit} from '@angular/core';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {RoomVM} from '../../../../../../../../../services/rooms/view-models/RoomVM';
import {BedVM} from '../../../../../../../../../services/beds/view-models/BedVM';
import {RoomAttachedBookingResultDO} from '../../../../../../../../../services/hotel-operations/room/data-objects/RoomAttachedBookingResultDO';
import {HotelRoomOperationsPageParam} from './services/utils/HotelRoomOperationsPageParam';
import {RoomOperationsPageService} from './services/RoomOperationsPageService';
import {RoomOperationsPageData} from './services/utils/RoomOperationsPageData';
import {RoomPreviewComponent} from '../../../../../../../../common/inventory/rooms/pages/room-preview/RoomPreviewComponent';

@Component({
    selector: 'room-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/room-operations/template/room-operations-page.html',
    directives: [LoadingComponent, RoomPreviewComponent],
    providers: [RoomOperationsPageService]
})
export class RoomOperationsPageComponent implements OnInit {
    @Input() roomOperationsPageParam: HotelRoomOperationsPageParam;

    isLoading: boolean;

    private _roomOperationsPageData: RoomOperationsPageData;

    constructor(private _appContext: AppContext,
        private _roomOperationsPageService: RoomOperationsPageService) { }

    public ngOnInit() {
        this.loadPageData();
    }
    private loadPageData() {
        this.isLoading = true;
        this._roomOperationsPageService.getPageData(this.roomOperationsPageParam).subscribe((pageData: RoomOperationsPageData) => {
            this._roomOperationsPageData = pageData;
            this.isLoading = false;
            this.updateContainerData();
        }, (err: ThError) => {
            this._appContext.toaster.error(err.message);
            this.isLoading = false;
        });
    }
    private updateContainerData() {
        this.roomOperationsPageParam.pageTitleText = this.roomVM.room.name;
    }

    public get roomVM(): RoomVM {
        return this._roomOperationsPageData.roomVM;
    }
    public get bedVMList(): BedVM[] {
        return this._roomOperationsPageData.bedVMList;
    }
    public get attachedBookingResult(): RoomAttachedBookingResultDO {
        return this._roomOperationsPageData.attachedBookingResult;
    }
    public get didLoadPageData(): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(this._roomOperationsPageData);
    }
}