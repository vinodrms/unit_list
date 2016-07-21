import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {RoomVM} from '../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomDO} from '../../../../../../../../../services/rooms/data-objects/RoomDO';
import {BedVM} from '../../../../../../../../../services/beds/view-models/BedVM';
import {RoomAttachedBookingResultDO} from '../../../../../../../../../services/hotel-operations/room/data-objects/RoomAttachedBookingResultDO';
import {HotelRoomOperationsPageParam} from './services/utils/HotelRoomOperationsPageParam';
import {RoomOperationsPageService} from './services/RoomOperationsPageService';
import {RoomOperationsPageData} from './services/utils/RoomOperationsPageData';
import {RoomPreviewComponent} from '../../../../../../../../common/inventory/rooms/pages/room-preview/RoomPreviewComponent';
import {RoomPreviewInput} from '../../../../../../../../common/inventory/rooms/pages/room-preview/utils/RoomPreviewInput';
import {RoomMaintenanceStatusEditorComponent} from './components/maintenance-status/RoomMaintenanceStatusEditorComponent';
import {DocumentHistoryViewerComponent} from '../../../../../../../../../../../common/utils/components/document-history/DocumentHistoryViewerComponent';

@Component({
    selector: 'room-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/room-operations/template/room-operations-page.html',
    directives: [LoadingComponent, CustomScroll, RoomPreviewComponent, RoomMaintenanceStatusEditorComponent, DocumentHistoryViewerComponent],
    providers: [RoomOperationsPageService],
    pipes: [TranslationPipe]
})
export class RoomOperationsPageComponent implements OnInit {
    @Output() onRoomChanged = new EventEmitter<boolean>();
    public triggerOnRoomChanged(roomDO: RoomDO) {
        this.onRoomChanged.next(true);
    }

    @Input() roomOperationsPageParam: HotelRoomOperationsPageParam;

    isLoading: boolean;

    private _roomOperationsPageData: RoomOperationsPageData;
    roomPreviewInput: RoomPreviewInput;

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
        this.roomPreviewInput = new RoomPreviewInput();
        this.roomPreviewInput.roomVM = this.roomVM;
        this.roomPreviewInput.bedVMList = this.bedVMList;
        this.roomPreviewInput.allRoomAmenities = this._roomOperationsPageData.allRoomAmenities;
        this.roomPreviewInput.allRoomAttributes = this._roomOperationsPageData.allRoomAttributes;
        this.roomOperationsPageParam.updateTitle(this.roomVM.room.name, this._appContext.thTranslation.translate("Floor %floorNumber%", { floorNumber: this.roomVM.room.floor }));
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