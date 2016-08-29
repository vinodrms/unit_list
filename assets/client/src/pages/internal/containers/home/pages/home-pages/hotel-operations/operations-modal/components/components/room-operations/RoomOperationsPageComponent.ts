import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {RoomVM} from '../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomDO} from '../../../../../../../../../services/rooms/data-objects/RoomDO';
import {BedVM} from '../../../../../../../../../services/beds/view-models/BedVM';
import {BookingDO} from '../../../../../../../../../services/bookings/data-objects/BookingDO';
import {RoomAttachedBookingResultVM} from '../../../../../../../../../services/hotel-operations/room/view-models/RoomAttachedBookingResultVM';
import {HotelRoomOperationsPageParam} from './utils/HotelRoomOperationsPageParam';
import {RoomOperationsPageService} from './services/RoomOperationsPageService';
import {RoomOperationsPageData} from './services/utils/RoomOperationsPageData';
import {RoomPreviewComponent} from '../../../../../../../../common/inventory/rooms/pages/room-preview/RoomPreviewComponent';
import {RoomPreviewInput} from '../../../../../../../../common/inventory/rooms/pages/room-preview/utils/RoomPreviewInput';
import {RoomMaintenanceStatusEditorComponent} from './components/maintenance-status/RoomMaintenanceStatusEditorComponent';
import {DocumentHistoryViewerComponent} from '../../../../../../../../../../../common/utils/components/document-history/DocumentHistoryViewerComponent';
import {RoomBookingPreviewComponent} from './components/booking-preview/RoomBookingPreviewComponent';
import {HotelOperationsResultService} from '../../../services/HotelOperationsResultService';

@Component({
    selector: 'room-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/room-operations/template/room-operations-page.html',
    directives: [LoadingComponent, CustomScroll, DocumentHistoryViewerComponent,
        RoomPreviewComponent, RoomMaintenanceStatusEditorComponent, RoomBookingPreviewComponent],
    providers: [RoomOperationsPageService],
    pipes: [TranslationPipe]
})
export class RoomOperationsPageComponent implements OnInit {
    @Input() roomOperationsPageParam: HotelRoomOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;
    roomOperationsPageData: RoomOperationsPageData;
    roomPreviewInput: RoomPreviewInput;

    constructor(private _appContext: AppContext,
        private _hotelOperationsResultService: HotelOperationsResultService,
        private _roomOperationsPageService: RoomOperationsPageService) { }

    public ngOnInit() {
        this.loadPageData();
        this._appContext.analytics.logPageView("/operations/room");
    }
    private loadPageData() {
        this.isLoading = true;
        this._roomOperationsPageService.getPageData(this.roomOperationsPageParam).subscribe((pageData: RoomOperationsPageData) => {
            this.roomOperationsPageData = pageData;
            this.isLoading = false;
            this.didInitOnce = true;
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
        this.roomPreviewInput.allRoomAmenities = this.roomOperationsPageData.allRoomAmenities;
        this.roomPreviewInput.allRoomAttributes = this.roomOperationsPageData.allRoomAttributes;
        this.roomOperationsPageParam.updateTitle(this.roomVM.room.name, this._appContext.thTranslation.translate("Floor %floorNumber%", { floorNumber: this.roomVM.room.floor }));
    }

    public get roomVM(): RoomVM {
        return this.roomOperationsPageData.roomVM;
    }
    public get bedVMList(): BedVM[] {
        return this.roomOperationsPageData.bedVMList;
    }
    public get attachedBookingResultVM(): RoomAttachedBookingResultVM {
        return this.roomOperationsPageData.attachedBookingResultVM;
    }
    public get didLoadPageData(): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(this.roomOperationsPageData)
            && !this._appContext.thUtils.isUndefinedOrNull(this.roomOperationsPageData.attachedBookingResultVM);
    }
    public get hasCheckedInBooking(): boolean {
        return this.roomOperationsPageData.attachedBookingResultVM.roomAttachedBookingResultDO.hasCheckedInBooking();
    }

    public didChangeBooking(booking: BookingDO) {
        this.loadPageData();
        this._hotelOperationsResultService.markBookingChanged(booking);
    }
    public didChangeRoom(roomDO: RoomDO) {
        this.roomOperationsPageData.roomVM.room = roomDO;
        this._hotelOperationsResultService.markRoomChanged(roomDO);
    }
}