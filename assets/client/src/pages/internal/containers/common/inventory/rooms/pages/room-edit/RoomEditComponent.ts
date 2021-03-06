import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {LoadingComponent} from '../../../../../../../../common/utils/components/LoadingComponent';
import {BaseFormComponent} from '../../../../../../../../common/base/BaseFormComponent';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {RoomVM} from '../../../../../../services/rooms/view-models/RoomVM';
import {RoomDO, RoomMaintenanceStatus} from '../../../../../../services/rooms/data-objects/RoomDO';
import {RoomAmenitiesDO} from '../../../../../../services/settings/data-objects/RoomAmenitiesDO';
import {RoomAttributesDO} from '../../../../../../services/settings/data-objects/RoomAttributesDO';
import {RoomCategoryDO} from '../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {LazyLoadRoomsService} from '../../../../../../services/rooms/LazyLoadRoomsService';
import {BedsEagerService} from '../../../../../../services/beds/BedsEagerService';
import {RoomEditService} from './services/RoomEditService';
import {RoomAmenitiesService} from '../../../../../../services/settings/RoomAmenitiesService';
import {RoomAttributesService} from '../../../../../../services/settings/RoomAttributesService';
import {RoomAttributeVMContainer, RoomAttributeVM} from './services/utils/RoomAttributeVMContainer';
import {RoomAmenityVMContainer, RoomAmenityVM} from './services/utils/RoomAmenityVMContainer';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {RoomCategoriesModalService} from '../../../modals/room-categories/services/RoomCategoriesModalService';
import {BedVM} from '../../../../../../services/beds/view-models/BedVM';
import {BedDO, BedStorageType} from '../../../../../../services/beds/data-objects/BedDO';
import {BedMetaDO} from '../../../../../../services/room-categories/data-objects/bed-config/BedMetaDO';
import {BedConfigDO} from '../../../../../../services/room-categories/data-objects/bed-config/BedConfigDO';
import {RoomCategoriesService} from '../../../../../../services/room-categories/RoomCategoriesService';

import * as _ from "underscore";

@Component({
    selector: 'room-edit',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/pages/room-edit/template/room-edit.html',
    providers: [RoomEditService, RoomCategoriesModalService]
})
export class RoomEditComponent extends BaseFormComponent implements OnInit {
    private MAX_BED_NO = 6;

    isLoading: boolean;
    isSavingRoom: boolean = false;
    newRoomCategoryToSave = false;

    roomAmenities: RoomAmenityVMContainer;
    roomAttributes: RoomAttributeVMContainer;

    allAvailableBeds: BedVM[];
    allAvailableStationaryBeds: BedVM[];
    allAvailableRollawayBeds: BedVM[];
    selectedStationaryBeds: BedVM[];
    selectedRollawayBeds: BedVM[];

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
        private _lazyLoadRoomsService: LazyLoadRoomsService,
        private _roomAmenitiesService: RoomAmenitiesService,
        private _roomAttributesService: RoomAttributesService,
        private _roomCategoriesService: RoomCategoriesService,
        private _roomCategoriesModalService: RoomCategoriesModalService,
        private _bedsEagerService: BedsEagerService) {
        super();

        this.selectedStationaryBeds = [];
        this.selectedRollawayBeds = [];
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
            this.initAvailableBedsArrays();
            this.initSelectedBedsArrays();
            this.isLoading = false;
        }, (error: ThError) => {
            this.isLoading = false;
            this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
        });
    }

    private initDefaultRoomData() {
        if (this._appContext.thUtils.isUndefinedOrNull(this._roomVM.category)) {
            this.selectedRollawayBeds = [];
            this.selectedStationaryBeds = [];
        }
        if (this._appContext.thUtils.isUndefinedOrNull(this.roomVM.room.maintenanceStatus)) {
            this.roomVM.room.maintenanceStatus = RoomMaintenanceStatus.Clean;
        }
        this.initAmenities();
        this.initAttributes();
    }
    private initAmenities() {
        if (this._appContext.thUtils.isUndefinedOrNull(this.roomAmenities)) { return; }
        if (this._appContext.thUtils.isUndefinedOrNull(this._roomVM.room.amenityIdList)) {
            this.roomAmenities.resetRoomAmenitySelection();
            return;
        }
        this.roomAmenities.updateRoomAmenitySelection(this._roomVM.room.amenityIdList);
    }
    private initAttributes() {
        if (this._appContext.thUtils.isUndefinedOrNull(this.roomAttributes)) { return; }
        if (this._appContext.thUtils.isUndefinedOrNull(this._roomVM.room.attributeIdList)) {
            this.roomAttributes.resetRoomAttributeSelection();
            return;
        }
        this.roomAttributes.updateRoomAttributeSelection(this._roomVM.room.attributeIdList);
    }
    private initForm() {
        this.didSubmitForm = false;
        this._roomEditService.updateFormValues(this._roomVM);
        this.initSelectedBedsArrays();
    }

    private initAvailableBedsArrays() {
        this.allAvailableStationaryBeds = _.filter(this.allAvailableBeds, (bedVM: BedVM) => {
            return bedVM.bed.storageType === BedStorageType.Stationary;
        });

        this.allAvailableRollawayBeds = _.filter(this.allAvailableBeds, (bedVM: BedVM) => {
            return bedVM.bed.storageType === BedStorageType.Rollaway;
        });
    }

    private initSelectedBedsArrays() {
        if (!this._appContext.thUtils.isUndefinedOrNull(this._roomVM.category)) {
            this.selectedRollawayBeds = [];
            this.selectedStationaryBeds = [];
            _.forEach(this.roomVM.category.bedConfig.bedMetaList, (bedMeta: BedMetaDO) => {
                var bedVM = _.find(this.allAvailableBeds, (bedVM: BedVM) => {
                    return bedVM.bed.id === bedMeta.bedId;
                });
                if (!this._appContext.thUtils.isUndefinedOrNull(bedVM)) {
                    for (var i = 0; i < bedMeta.noOfInstances; ++i) {
                        if (bedVM.bed.storageType === BedStorageType.Rollaway) {
                            this.selectedRollawayBeds.push(bedVM);
                        }
                        else if (bedVM.bed.storageType === BedStorageType.Stationary) {
                            this.selectedStationaryBeds.push(bedVM);
                        }
                    }
                }
            });
        }
    }

    protected getDefaultFormGroup(): FormGroup {
        return this._roomEditService.roomForm;
    }

    public isNewRoom(): boolean {
        return this._roomVM.room.id == null || this._roomVM.room.id.length == 0;
    }

    public saveRoom() {

        this.didSubmitForm = true;
        if (!this._roomEditService.isValidForm() || this.roomCategoryNotSelected || !this.atLeastAStationaryOrARollawayBedWasAdded) {
            var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
            this._appContext.toaster.error(errorMessage);
            return;
        }
        var room = this._roomVM.room;
        this._roomEditService.updateRoom(room);

        room.amenityIdList = this.roomAmenities.getSelectedRoomAmenityList();
        room.attributeIdList = this.roomAttributes.getSelectedRoomAttributeList();
        room.categoryId = this.roomVM.category.id;

        this.isSavingRoom = true;

        if (this.newRoomCategoryToSave) {
            this.prepareRoomCategoryForSave();
            this._roomCategoriesService.saveRoomCategory(this.roomVM.category).subscribe((roomCategory: RoomCategoryDO) => {
                this._lazyLoadRoomsService.saveRoomDO(room).subscribe((updatedRoom: RoomDO) => {
                    this.isSavingRoom = false;
                    this.showViewScreen();
                }, (error: ThError) => {
                    this.isSavingRoom = false;
                    this._appContext.toaster.error(error.message);
                });
            }, (error: ThError) => {
                this.isSavingRoom = false;
                this._appContext.toaster.error(error.message);
            });
        }
        else {
            this._lazyLoadRoomsService.saveRoomDO(room).subscribe((updatedRoom: RoomDO) => {
                this.isSavingRoom = false;
                this.showViewScreen();
            }, (error: ThError) => {
                this.isSavingRoom = false;
                this._appContext.toaster.error(error.message);
            });
        }
    }

    private prepareRoomCategoryForSave() {
        if (this._appContext.thUtils.isUndefinedOrNull(this.roomVM.category.bedConfig)) {
            this.roomVM.category.bedConfig = new BedConfigDO();
        }
        if (this._appContext.thUtils.isUndefinedOrNull(this.roomVM.category.bedConfig.bedMetaList) ||
            _.isEmpty(this.roomVM.category.bedConfig.bedMetaList)) {
            this.roomVM.category.bedConfig.bedMetaList = this.getBedMetaList();
        }
    }

    private getBedMetaList(): BedMetaDO[] {
        var bedMetaList: BedMetaDO[] = [];
        _.forEach(this.selectedStationaryBeds, (bedVM: BedVM) => {
            var foundBedMeta = _.find(bedMetaList, (bedMeta: BedMetaDO) => {
                return bedMeta.bedId === bedVM.bed.id;
            });
            if (this._appContext.thUtils.isUndefinedOrNull(foundBedMeta)) {
                var newBedMeta = new BedMetaDO();
                newBedMeta.bedId = bedVM.bed.id;
                newBedMeta.noOfInstances = 1;
                bedMetaList.push(newBedMeta);
            }
            else {
                foundBedMeta.noOfInstances++;
            }
        });
        _.forEach(this.selectedRollawayBeds, (bedVM: BedVM) => {
            var foundBedMeta = _.find(bedMetaList, (bedMeta: BedMetaDO) => {
                return bedMeta.bedId === bedVM.bed.id;
            });
            if (this._appContext.thUtils.isUndefinedOrNull(foundBedMeta)) {
                var newBedMeta = new BedMetaDO();
                newBedMeta.bedId = bedVM.bed.id;
                newBedMeta.noOfInstances = 1;
                bedMetaList.push(newBedMeta);
            }
            else {
                foundBedMeta.noOfInstances++;
            }
        });

        return bedMetaList;
    }

    public didUploadImage(imageUrl: string) {
        this.roomVM.imageUrl = imageUrl;
    }

    public openRoomCategorySelectModal() {
        this.getRoomCategoriesModalPromise().then((modalDialogInstance: ModalDialogRef<RoomCategoryDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedRoomCategoryList: RoomCategoryDO[]) => {
                if (selectedRoomCategoryList.length > 0) {
                    if (this._appContext.thUtils.isUndefinedOrNull(this.roomVM.category) ||
                        (!this._appContext.thUtils.isUndefinedOrNull(this.roomVM.category) && this.roomVM.category.displayName != selectedRoomCategoryList[0].displayName)) {
                        this.roomVM.category = selectedRoomCategoryList[0];
                        this.onRoomCategoryChanged();
                    }
                }
            });
        }).catch((e: any) => { });
    }

    private getRoomCategoriesModalPromise(): Promise<ModalDialogRef<RoomCategoryDO[]>> {
        if (this.roomCategoryNotSelected) {
            return this._roomCategoriesModalService.openAllCategoriesModal(true);
        }
        else {
            return this._roomCategoriesModalService.openAllCategoriesModal(true, this.roomVM.category.id);
        }
    }

    public get roomCategoryNotSelected(): boolean {
        return this._appContext.thUtils.isUndefinedOrNull(this.roomVM.category);
    }

    public onRoomCategoryChanged() {
        this.initSelectedBedsArrays();
    }

    public get atLeastAStationaryOrARollawayBedWasAdded(): boolean {
        return !_.isEmpty(this.selectedRollawayBeds) || !_.isEmpty(this.selectedStationaryBeds);
    }

    public diChangeStationarySelectedBedList(savedBedVMList: BedVM[]) {
        this.selectedStationaryBeds = savedBedVMList;
        this.newRoomCategoryToSave = true;
    }
    public diChangeRollawaySelectedBedList(savedBedVMList: BedVM[]) {
        this.selectedRollawayBeds = savedBedVMList;
        this.newRoomCategoryToSave = true;
    }
    public get roomCategoryConfigured(): boolean {
        return _.isEmpty(this.selectedStationaryBeds) && _.isEmpty(this.selectedRollawayBeds) && !this._appContext.thUtils.isUndefinedOrNull(this._roomVM.category);
    }
}