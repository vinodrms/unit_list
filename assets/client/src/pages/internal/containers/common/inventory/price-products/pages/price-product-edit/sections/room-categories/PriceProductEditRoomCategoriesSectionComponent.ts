import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {ModalDialogInstance} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {RoomCategoriesModalService} from '../../../../../modals/room-categories/services/RoomCategoriesModalService';
import {RoomCategoryDO} from '../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';

@Component({
	selector: 'price-product-edit-room-categories-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/room-categories/template/price-product-edit-room-categories-section.html',
	providers: [RoomCategoriesModalService],
	pipes: [TranslationPipe]
})
export class PriceProductEditRoomCategoriesSectionComponent extends BaseComponent implements IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;
	
	@Output() onRoomCategoryChange = new EventEmitter();
	public triggerRoomCategoryChange() {
		this.onRoomCategoryChange.next(this._roomCategoryList);
	}

	private _roomCategoryList: RoomCategoryDO[];

	constructor(private _roomCategoriesModalService: RoomCategoriesModalService) {
		super();
	}

	public isValid(): boolean {
		return this._roomCategoryList.length > 0;
	}
	public initializeFrom(priceProductVM: PriceProductVM) {
		this._roomCategoryList = [];
		if (priceProductVM.roomCategoryList && priceProductVM.roomCategoryList.length > 0) {
			this._roomCategoryList = this._roomCategoryList.concat(priceProductVM.roomCategoryList);
		}
	}
	public updateDataOn(priceProductVM: PriceProductVM) {
		priceProductVM.roomCategoryList = this._roomCategoryList;
		priceProductVM.priceProduct.roomCategoryIdList = _.map(this._roomCategoryList, (roomCateg: RoomCategoryDO) => { return roomCateg.id });
	}

	public removeRoomCategory(roomCategory: RoomCategoryDO) {
		this._roomCategoryList = _.filter(this._roomCategoryList, (arrayRoomCateg: RoomCategoryDO) => { return arrayRoomCateg.id !== roomCategory.id });
		this.triggerRoomCategoryChange();
	}

	public openRoomCategorySelectModal() {
		this._roomCategoriesModalService.openUsedCategoriesModal().then((modalDialogInstance: ModalDialogInstance<RoomCategoryDO>) => {
			modalDialogInstance.resultObservable.subscribe((selectedRoomCategory: RoomCategoryDO) => {
				this.addRoomCategoryIfNotExists(selectedRoomCategory);
			});
		}).catch((e: any) => { });
	}
	private addRoomCategoryIfNotExists(roomCategoryToAdd: RoomCategoryDO) {
		var foundRoomCategory = _.find(this._roomCategoryList, (roomCategory: RoomCategoryDO) => { return roomCategory.id === roomCategoryToAdd.id });
		if (!foundRoomCategory) {
			this._roomCategoryList.push(roomCategoryToAdd);
			this.triggerRoomCategoryChange();
		}
	}

	public get roomCategoryList(): RoomCategoryDO[] {
		return this._roomCategoryList;
	}
	public set roomCategoryList(roomCategoryList: RoomCategoryDO[]) {
		this._roomCategoryList = roomCategoryList;
	}
}