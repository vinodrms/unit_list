import {Component, OnInit} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../common/utils/AppContext';
import {CopyPriceProductValuesModalInput} from './services/utils/CopyPriceProductValuesModalInput';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {ICustomModalComponent, ModalSize} from "../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import {ModalDialogRef} from "../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import {RoomCategoryDO} from "../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO";

@Component({
    selector: 'copy-price-product-values-modal',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/copy-price-product-values-modal/template/copy-price-product-values-modal-component.html'
})
export class CopyPriceProductValuesModalComponent extends BaseComponent implements ICustomModalComponent {
    
    private _selectedCategory: RoomCategoryDO;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<RoomCategoryDO>,
        private _copyPriceProductValuesModalInput: CopyPriceProductValuesModalInput) {
            super();
    }

    public isBlocking() : boolean {
        return false;
    }

    public getSize(): ModalSize {
        return ModalSize.Small;
    }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }

    public selectRoomCategory(roomCategory: RoomCategoryDO) {
        this._selectedCategory = roomCategory;
    }

    public get selectedCategory(): RoomCategoryDO {
        return this._selectedCategory;
    }

    public get roomCategories(): RoomCategoryDO[] {
        return this._copyPriceProductValuesModalInput.roomCategoryList;
    }

    public finalizeRoomCategorySelection() {
        this._modalDialogRef.addResult(this._selectedCategory);
        this.closeDialog();
    }
}