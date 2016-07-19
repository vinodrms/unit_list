import {Component, AfterViewInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../common/utils/components/LoadingComponent';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {RoomSelectionService} from './services/RoomSelectionService';
import {RoomSelectionTableMetaBuilderService} from './services/RoomSelectionTableMetaBuilderService';
import {AssignableRoomVM} from './services/view-models/AssignableRoomVM';
import {RoomVM} from '../../../../../../../../services/rooms/view-models/RoomVM';

@Component({
    selector: 'room-selection',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/assign-room/components/room-selection/template/room-selection.html',
    providers: [RoomSelectionService, RoomSelectionTableMetaBuilderService],
    directives: [LoadingComponent, LazyLoadingTableComponent],
    pipes: [TranslationPipe]
})
export class RoomSelectionComponent implements AfterViewInit {
    @Output() onRoomSelected = new EventEmitter<RoomVM>();
    public triggerOnRoomSelected(assignableRoom: AssignableRoomVM) {
        this.onRoomSelected.next(assignableRoom.roomVM);
    }

    @ViewChild(LazyLoadingTableComponent) private _roomsTableComponent: LazyLoadingTableComponent<AssignableRoomVM>;
    protected didInit: boolean = false;

    protected bookingRoomCategoryName: string;
    private _filterByBookingRoomCategory: boolean;

    constructor(private _roomSelectionService: RoomSelectionService,
        private _tableMetaBuilder: RoomSelectionTableMetaBuilderService) { }

    public ngAfterViewInit() {
        this.bootstrapTable();
        this._roomSelectionService.getRoomsWithOccupancyVM().subscribe((roomContainer: any) => {
            this.bookingRoomCategoryName = this._roomSelectionService.bookingRoomCategoryStats.roomCategory.displayName;
            this.filterByBookingRoomCategory = true;
            this.didInit = true;
        });
    }
    private bootstrapTable() {
        this._roomsTableComponent.bootstrap(this._roomSelectionService, this._tableMetaBuilder.buildLazyLoadTableMeta());
        this._roomsTableComponent.attachCustomCellClassGenerator(this._tableMetaBuilder.customCellClassGeneratorForBookingCart);
        this._roomsTableComponent.attachCustomRowClassGenerator(this._tableMetaBuilder.customRowClassGeneratorForBookingCart);
    }

    public didSelectRoom(assignableRoom: AssignableRoomVM) {
        if (!assignableRoom.isAssignableToBooking) { return; }
        this._roomsTableComponent.selectItem(assignableRoom);
        this.triggerOnRoomSelected(assignableRoom);
    }

    public get filterByBookingRoomCategory(): boolean {
        return this._filterByBookingRoomCategory;
    }
    public set filterByBookingRoomCategory(filterByBookingRoomCategory: boolean) {
        this._filterByBookingRoomCategory = filterByBookingRoomCategory;
        var roomCategoryId = this._roomSelectionService.bookingRoomCategoryStats.roomCategory.id;
        if (filterByBookingRoomCategory) {
            this._roomSelectionService.assignableRoomVMContainer.filterRoomCategoryId(roomCategoryId);
        }
        else {
            this._roomSelectionService.assignableRoomVMContainer.filterOtherCategoriesThanRoomCategoryId(roomCategoryId);
        }
        this._roomSelectionService.refreshData();
    }
}