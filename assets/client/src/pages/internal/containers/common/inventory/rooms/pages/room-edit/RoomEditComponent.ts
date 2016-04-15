import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../common/utils/components/LoadingComponent';
import {ImageUploadComponent} from '../../../../../../../../common/utils/components/image-upload/ImageUploadComponent';
import {BaseFormComponent} from '../../../../../../../../common/base/BaseFormComponent';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {RoomVM} from '../../../../../../services/rooms/view-models/RoomVM';
import {RoomDO, RoomMaintenanceStatus} from '../../../../../../services/rooms/data-objects/RoomDO';
import {RoomAmenitiesDO} from '../../../../../../services/settings/data-objects/RoomAmenitiesDO';
import {RoomAttributesDO} from '../../../../../../services/settings/data-objects/RoomAttributesDO';
import {RoomCategoryDO} from '../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {RoomsService} from '../../../../../../services/rooms/RoomsService';
import {BedsEagerService} from '../../../../../../services/beds/BedsEagerService';
import {RoomEditService} from './services/RoomEditService';
import {RoomAmenitiesService} from '../../../../../../services/settings/RoomAmenitiesService';
import {RoomAttributesService} from '../../../../../../services/settings/RoomAttributesService';
import {RoomAttributeVMContainer, RoomAttributeVM} from './services/utils/RoomAttributeVMContainer';
import {RoomAmenityVMContainer, RoomAmenityVM} from './services/utils/RoomAmenityVMContainer';
import {ModalDialogInstance} from '../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {RoomCategoriesModalService} from '../../../modals/room-categories/services/RoomCategoriesModalService';
import {BedsModalService} from '../../../modals/beds/services/BedsModalService';
import {BedVM} from '../../../../../../services/beds/view-models/BedVM';

@Component({
    selector: 'room-edit',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/pages/room-edit/template/room-edit.html',
    providers: [RoomEditService, RoomCategoriesModalService, BedsModalService],
    directives: [LoadingComponent, ImageUploadComponent],
    pipes: [TranslationPipe]
})
export class RoomEditComponent extends BaseFormComponent implements OnInit {
    private MAX_BED_NO = 6;

    isLoading: boolean;
    isSavingRoom: boolean = false;

    roomAmenities: RoomAmenityVMContainer;
    roomAttributes: RoomAttributeVMContainer;
    allAvailableBeds: BedVM[];
    emptySlots: Object[];

    private _roomVM: RoomVM;
    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    @Input()
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
        this.initDefaultRoomData();
        this.initForm();
    }
    @Output() onExit = new EventEmitter();
    public showViewScreen() {
        this.onExit.next(true);
    }

    constructor(private _appContext: AppContext,
        private _roomEditService: RoomEditService,
        private _roomsService: RoomsService,
        private _roomAmenitiesService: RoomAmenitiesService,
        private _roomAttributesService: RoomAttributesService,
        private _roomCategoriesModalService: RoomCategoriesModalService,
        private _bedsEagerService: BedsEagerService,
        private _bedsModalService: BedsModalService) {
        super();
    }

    ngOnInit() {
        this.isLoading = true;

        Observable.combineLatest(
            this._roomAmenitiesService.getRoomAmenitiesDO(),
            this._roomAttributesService.getRoomAttributesDO(),
            this._bedsEagerService.getBedAggregatedList()
        ).subscribe((result: [RoomAmenitiesDO, RoomAttributesDO, BedVM[]]) => {
            this.roomAmenities = new RoomAmenityVMContainer(result[0], this._roomVM.room.amenityIdList);
            this.roomAttributes = new RoomAttributeVMContainer(result[1], this._roomVM.room.attributeIdList);
            this.allAvailableBeds = result[2];

            this.initDefaultRoomData();
            this.isLoading = false;
        }, (error: ThError) => {
            this.isLoading = false;
            this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
        });
    }

    private initDefaultRoomData() {
        if (this._appContext.thUtils.isUndefinedOrNull(this.roomVM.bedList)) {
            this.roomVM.bedList = [];
        }
        if (this._appContext.thUtils.isUndefinedOrNull(this.roomVM.room.maintenanceStatus)) {
            this.roomVM.room.maintenanceStatus = RoomMaintenanceStatus.CheckInReady;
        }
        if (this._appContext.thUtils.isUndefinedOrNull(this._roomVM.room.amenityIdList) && 
            !this._appContext.thUtils.isUndefinedOrNull(this.roomAmenities)) {
            this.roomAmenities.resetRoomAmenitySelection();
        }
        if (this._appContext.thUtils.isUndefinedOrNull(this._roomVM.room.attributeIdList) &&
            !this._appContext.thUtils.isUndefinedOrNull(this.roomAttributes)) {
            this.roomAttributes.resetRoomAttributeSelection();
        };
        this.resetEmptySlots();
    }
    private initForm() {
        this.didSubmitForm = false;
        this._roomEditService.updateFormValues(this._roomVM);
    }

    protected getDefaultControlGroup(): ControlGroup {
        return this._roomEditService.roomForm;
    }

    public isNewRoom(): boolean {
        return this._roomVM.room.id == null || this._roomVM.room.id.length == 0;
    }

    public saveRoom() {
        this.didSubmitForm = true;
        if (!this._roomEditService.isValidForm() || this.roomCategoryNotSelected) {
            var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
            this._appContext.toaster.error(errorMessage);
            return;
        }
        var room = this._roomVM.room;
        this._roomEditService.updateRoom(room);

        room.amenityIdList = this.roomAmenities.getSelectedRoomAmenityList();
        room.attributeIdList = this.roomAttributes.getSelectedRoomAttributeList();
        room.categoryId = this.roomVM.category.id;
        room.bedIdList = [];

        _.forEach(this.roomVM.bedList, (bedVM: BedVM) => {
            room.bedIdList.push(bedVM.bed.id);
        });

        this.isSavingRoom = true;

        this._roomsService.saveRoomDO(room).subscribe((updatedRoom: RoomDO) => {
            this.isSavingRoom = false;
            this.showViewScreen();
        }, (error: ThError) => {
            this.isSavingRoom = false;
            this._appContext.toaster.error(error.message);
        });
    }

    public didUploadImage(imageUrl: string) {
        this.roomVM.imageUrl = imageUrl;
    }

    public addBed(bedVM: BedVM) {
        this.roomVM.bedList.push(bedVM);
        this.resetEmptySlots();
    }
    public removeBed(bedIndex: number) {

        var title = this._appContext.thTranslation.translate("Remove Bed");
        var content = this._appContext.thTranslation.translate("Are you sure you want to remove one %name% from this room ?", { name: this.roomVM.bedList[bedIndex].bed.name });
        var positiveLabel = this._appContext.thTranslation.translate("Yes");
        var negativeLabel = this._appContext.thTranslation.translate("No");
        this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            this.roomVM.bedList.splice(bedIndex, 1);
            this.resetEmptySlots();
        });
    }

    private resetEmptySlots() {
        if (this._appContext.thUtils.isUndefinedOrNull(this.emptySlots)) {
            this.emptySlots = [];
        }
        var emptySlotsNO = this.MAX_BED_NO - this.roomVM.bedList.length;
        if (emptySlotsNO < this.emptySlots.length) {
            while (emptySlotsNO != this.emptySlots.length) {
                this.emptySlots.splice(0, 1);
            }
        }
        else if (emptySlotsNO > this.emptySlots.length) {
            while (emptySlotsNO != this.emptySlots.length) {
                this.emptySlots.push(new Object());
            }
        }
    }

    public openRoomCategorySelectModal() {
        this.getRoomCategoriesModalPromise().then((modalDialogInstance: ModalDialogInstance<RoomCategoryDO>) => {
            modalDialogInstance.resultObservable.subscribe((selectedRoomCategory: RoomCategoryDO) => {
                this.roomVM.category = selectedRoomCategory;
            });
        }).catch((e: any) => { });
    }

    private getRoomCategoriesModalPromise(): Promise<ModalDialogInstance<RoomCategoryDO>> {
        if (this.roomCategoryNotSelected) {
            return this._roomCategoriesModalService.openAllCategoriesModal(true);
        }
        else {
            return this._roomCategoriesModalService.openAllCategoriesModal(true, this.roomVM.category.id);
        }
    }

    public get maximuNumberOfBedsReached(): boolean {
        return this.MAX_BED_NO === this.roomVM.bedList.length;
    }

    public get roomCategoryNotSelected(): boolean {
        return this._appContext.thUtils.isUndefinedOrNull(this.roomVM.category);
    }

    public openBedsSelectModal() {
        this._bedsModalService.openAllBedsModal(this.allAvailableBeds).then((modalDialogInstance: ModalDialogInstance<BedVM>) => {
            modalDialogInstance.resultObservable.subscribe((selectedBed: BedVM) => {
                this.addBed(selectedBed);
            });
        }).catch((e: any) => { });
    }
}