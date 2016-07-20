import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {ConfigCapacityComponent} from '../../../../../../../../common/utils/components/ConfigCapacityComponent';
import {ImageUploadComponent} from '../../../../../../../../common/utils/components/image-upload/ImageUploadComponent';
import {RoomVM} from '../../../../../../services/rooms/view-models/RoomVM';
import {BedVM} from '../../../../../../services/beds/view-models/BedVM';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {BedSelectorComponent} from '../room-edit/components/bed-selector/BedSelectorComponent';
import {RoomAmenityVMContainer} from '../room-edit/services/utils/RoomAmenityVMContainer';
import {RoomAttributeVMContainer} from '../room-edit/services/utils/RoomAttributeVMContainer';
import {RoomPreviewInput} from './utils/RoomPreviewInput';

@Component({
    selector: 'room-preview',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/pages/room-preview/template/room-preview.html',
    directives: [ConfigCapacityComponent, ImageUploadComponent, BedSelectorComponent],
    pipes: [TranslationPipe]
})
export class RoomPreviewComponent implements OnInit {
    private _didInit: boolean = false;

    roomAmenities: RoomAmenityVMContainer;
    roomAttributes: RoomAttributeVMContainer;

    private _roomPreviewInput: RoomPreviewInput;
    public get roomPreviewInput(): RoomPreviewInput {
        return this._roomPreviewInput;
    }
    @Input()
    public set roomPreviewInput(roomPreviewInput: RoomPreviewInput) {
        this._roomPreviewInput = roomPreviewInput;
        this.loadDependentData();
    }

    constructor(private _appContext: AppContext) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._roomPreviewInput)) { return };

        this.roomAmenities = new RoomAmenityVMContainer(this._roomPreviewInput.allRoomAmenities, this.roomVM.room.amenityIdList);
        this.roomAttributes = new RoomAttributeVMContainer(this._roomPreviewInput.allRoomAttributes, this.roomVM.room.attributeIdList);
    }

    public get roomVM(): RoomVM {
        return this._roomPreviewInput.roomVM;
    }
    public get bedVMList(): BedVM[] {
        return this._roomPreviewInput.bedVMList;
    }
}