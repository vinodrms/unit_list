import {Component} from '@angular/core';
import {BaseComponent} from "../../../../../../../../../../../common/base/BaseComponent";
import {ICustomModalComponent, ModalSize} from "../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import {AppContext} from "../../../../../../../../../../../common/utils/AppContext";
import {ModalDialogRef} from "../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import {RoomCategoryItemDO} from '../../../../services/search/data-objects/room-category-item/RoomCategoryItemDO';
import {RoomAvailabilityModalInput} from './util/RoomAvailabilityModalInput';

@Component({
    selector: "room-availability-modal",
    templateUrl: "/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/modal/template/room-availability-modal.html"
})
export class RoomAvailabilityModalComponent extends BaseComponent implements ICustomModalComponent {

    private _roomCategoryItemList : RoomCategoryItemDO[];

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<any>,
        private _roomAvailabilityModalInput: RoomAvailabilityModalInput ) {
        super();
        this._roomCategoryItemList = _roomAvailabilityModalInput.roomCategoryItemList;
    }

    public isBlocking() : boolean {
        return false;
    }

    public getSize(): ModalSize {
        return ModalSize.Medium;
    }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }

    public get roomCategoryItemList(): RoomCategoryItemDO[] {
        return this._roomCategoryItemList;
    }
}