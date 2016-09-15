import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../../../../common/utils/AppContext';
import {NumberSuffixFormatter} from '../../../../../../../../../../common/utils/form-utils/NumberSuffixFormatter';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {PricePerPersonDO} from '../../../../../../../../services/price-products/data-objects/price/price-per-person/PricePerPersonDO';
import {PriceProductPriceType, PriceProductPriceConfigurationState} from '../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import {PriceProductPriceDO} from '../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO';
import {SinglePriceDO} from '../../../../../../../../services/price-products/data-objects/price/single-price/SinglePriceDO';
import {RoomCategoriesStatsService} from '../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import {RoomCategoryDO} from '../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {RoomCategoryStatsDO} from '../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import {PricePerPersonContainer} from './utils/PricePerPersonContainer';
import {SinglePriceContainer} from './utils/SinglePriceContainer';
import {IPriceContainer} from './utils/IPriceContainer';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';

@Component({
	selector: 'price-product-edit-prices-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/template/price-product-edit-prices-section.html',
	providers: [RoomCategoriesStatsService]
})
export class PriceProductEditPricesSectionComponent extends BaseComponent implements IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	pricePerPersonContainer: PricePerPersonContainer;
	singlePriceContainer: SinglePriceContainer;

	private _currentRoomCategoryStatsList: RoomCategoryStatsDO[];

	private _isPricePerNumberOfPersons: boolean;
	isLoading: boolean = false;
	private _numberSuffixFormatter: NumberSuffixFormatter;
	ccy: CurrencyDO;

	constructor(private _appContext: AppContext,
		private _roomCategoriesStatsService: RoomCategoriesStatsService) {
		super();
		this.ccy = new CurrencyDO();
		this._numberSuffixFormatter = new NumberSuffixFormatter(this._appContext.thTranslation);
		this.pricePerPersonContainer = new PricePerPersonContainer();
		this.singlePriceContainer = new SinglePriceContainer();
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
		this.singlePriceContainer.initializeFrom(priceProductVM.priceProduct.price.type, priceProductVM.priceProduct.price.priceList);
		this.pricePerPersonContainer.initializeFrom(priceProductVM.priceProduct.price.type, priceProductVM.priceProduct.price.priceList);
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
			priceProductVM.priceProduct.price.priceConfigurationState = PriceProductPriceConfigurationState.Valid;
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
	public getNumberSuffix(inputNumber: number) {
		return this._numberSuffixFormatter.getNumberSuffix(inputNumber);
	}
	public getNoRoomsLabel(noOfRooms: number): string {
		if (noOfRooms === 1) {
			return this._appContext.thTranslation.translate("%noOfRooms% Room", { noOfRooms: noOfRooms });
		}
		return this._appContext.thTranslation.translate("%noOfRooms% Rooms", { noOfRooms: noOfRooms });
	}
	public get priceContainer(): IPriceContainer {
		if (this._isPricePerNumberOfPersons) {
			return this.pricePerPersonContainer;
		}
		return this.singlePriceContainer;
	}
	public roomCategoryHasOnlyOneAdultAndZeroChildren(roomCategStats: RoomCategoryStatsDO): boolean {
		var totalCapacity = roomCategStats.capacity.totalCapacity;
		return totalCapacity.noAdults === 1 && totalCapacity.noChildren === 0;
	}
}