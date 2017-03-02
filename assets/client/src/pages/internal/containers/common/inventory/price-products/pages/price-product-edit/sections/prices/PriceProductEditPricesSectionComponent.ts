import { Component, Input } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../common/base/BaseComponent';
import { AppContext, ThError } from '../../../../../../../../../../common/utils/AppContext';
import { IPriceProductEditSection } from '../utils/IPriceProductEditSection';
import { PriceProductVM } from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import { PricePerPersonDO } from '../../../../../../../../services/price-products/data-objects/price/price-per-person/PricePerPersonDO';
import { PriceProductPriceType } from '../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import { PriceProductPriceDO } from '../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO';
import { SinglePriceDO } from '../../../../../../../../services/price-products/data-objects/price/single-price/SinglePriceDO';
import { RoomCategoriesStatsService } from '../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import { RoomCategoryDO } from '../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import { RoomCategoryStatsDO } from '../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { PriceContainer } from './utils/PriceContainer';
import { CurrencyDO } from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import { ISOWeekDayUtils, ISOWeekDayVM, ISOWeekDay } from '../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay';
import { PriceExceptionDO } from '../../../../../../../../services/price-products/data-objects/price/price-exceptions/PriceExceptionDO';

@Component({
	selector: 'price-product-edit-prices-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/template/price-product-edit-prices-section.html',
	providers: [RoomCategoriesStatsService]
})
export class PriceProductEditPricesSectionComponent extends BaseComponent implements IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	pricePerPersonContainer: PriceContainer;
	singlePriceContainer: PriceContainer;

	private _currentRoomCategoryStatsList: RoomCategoryStatsDO[];

	private _isoWeekDayUtils: ISOWeekDayUtils;
	private _isPricePerNumberOfPersons: boolean;
	isLoading: boolean = false;
	ccy: CurrencyDO;

	constructor(private _appContext: AppContext,
		private _roomCategoriesStatsService: RoomCategoriesStatsService) {
		super();
		this._isoWeekDayUtils = new ISOWeekDayUtils();
		this.ccy = new CurrencyDO();
		this.pricePerPersonContainer = new PriceContainer(PriceProductPriceType.PricePerPerson);
		this.singlePriceContainer = new PriceContainer(PriceProductPriceType.SinglePrice);
	}

	public isValid(): boolean {
		return this.priceContainer.isValid();
	}
	public initializeFrom(priceProductVM: PriceProductVM) {
		this.ccy = priceProductVM.ccy;
		this._isPricePerNumberOfPersons = true;
		this._currentRoomCategoryStatsList = [];
		if (priceProductVM.priceProduct.price && priceProductVM.priceProduct.price.type != null) {
			this.updateCurrentPriceFrom(priceProductVM);
			this._isPricePerNumberOfPersons = (priceProductVM.priceProduct.price.type === PriceProductPriceType.PricePerPerson);
		}
		this.updatePricesForRoomCategories(priceProductVM.roomCategoryList);
	}
	private updateCurrentPriceFrom(priceProductVM: PriceProductVM) {
		this.singlePriceContainer.initializeFrom(priceProductVM.priceProduct.price);
		this.pricePerPersonContainer.initializeFrom(priceProductVM.priceProduct.price);
	}
	public updatePricesForRoomCategories(roomCategoryList: RoomCategoryDO[]) {
		if (this._appContext.thUtils.isUndefinedOrNull(roomCategoryList) || (_.isArray(roomCategoryList) && roomCategoryList.length == 0)) {
			this.currentRoomCategoryStatsList = [];
			return;
		}
		this.isLoading = true;
		this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryList(roomCategoryList).subscribe((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
			this.currentRoomCategoryStatsList = roomCategoryStatsList;
			this.isLoading = false;
		}, (err: ThError) => {
			this._appContext.toaster.error(err.message);
		});
	}

	public updateDataOn(priceProductVM: PriceProductVM) {
		if (!priceProductVM.priceProduct.price) {
			priceProductVM.priceProduct.price = new PriceProductPriceDO();
		}
		this.priceContainer.updatePricesOn(priceProductVM);
	}

	public get isPricePerNumberOfPersons(): boolean {
		return this._isPricePerNumberOfPersons;
	}
	public set isPricePerNumberOfPersons(isPricePerNumberOfPersons: boolean) {
		if (this.readonly) {
			return;
		}
		this._isPricePerNumberOfPersons = isPricePerNumberOfPersons;
	}
	public get priceType(): PriceProductPriceType {
		if (this._isPricePerNumberOfPersons) {
			return PriceProductPriceType.PricePerPerson;
		}
		return PriceProductPriceType.SinglePrice;
	}

	public get currentRoomCategoryStatsList(): RoomCategoryStatsDO[] {
		return this._currentRoomCategoryStatsList;
	}
	public set currentRoomCategoryStatsList(currentRoomCategoryStatsList: RoomCategoryStatsDO[]) {
		this._currentRoomCategoryStatsList = currentRoomCategoryStatsList;
		this.pricePerPersonContainer.updateFromRoomCategoryStatsList(currentRoomCategoryStatsList);
		this.singlePriceContainer.updateFromRoomCategoryStatsList(currentRoomCategoryStatsList);
	}

	public displayError() {
		return this.didSubmit || this.readonly;
	}

	public getNoRoomsLabel(noOfRooms: number): string {
		if (noOfRooms === 1) {
			return this._appContext.thTranslation.translate("%noOfRooms% Room", { noOfRooms: noOfRooms });
		}
		return this._appContext.thTranslation.translate("%noOfRooms% Rooms", { noOfRooms: noOfRooms });
	}
	public get priceContainer(): PriceContainer {
		if (this._isPricePerNumberOfPersons) {
			return this.pricePerPersonContainer;
		}
		return this.singlePriceContainer;
	}
	public getWeekDayName(iSOWeekDay: ISOWeekDay): string {
		return this._isoWeekDayUtils.getISOWeekDayVM(iSOWeekDay).name;
	}

	public removeException(exception: PriceExceptionDO) {
		// TODO
	}
	public openExceptionSelectionModal() {
		// TODO
	}
}