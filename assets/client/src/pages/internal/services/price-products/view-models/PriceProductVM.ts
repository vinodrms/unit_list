import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';
import {PriceProductDO, PriceProductAvailability} from '../data-objects/PriceProductDO';
import {PriceProductPriceType} from '../data-objects/price/IPriceProductPrice';
import {TaxContainerDO} from '../../taxes/data-objects/TaxContainerDO';
import {TaxDO} from '../../taxes/data-objects/TaxDO';
import {RoomCategoryDO} from '../../room-categories/data-objects/RoomCategoryDO';
import {YieldFiltersDO} from '../../hotel-configurations/data-objects/YieldFiltersDO';
import {YieldFilterValueVM} from './YieldFilterValueVM';
import {YieldFilterDO} from '../../common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../common/data-objects/yield-filter/YieldFilterValueDO';
import {PriceProductYieldFilterMetaDO} from '../data-objects/yield-filter/PriceProductYieldFilterDO';

export class PriceProductVM {
	private _priceProduct: PriceProductDO;
	private _vatTax: TaxDO;
	private _otherTaxList: TaxDO[];
	private _roomCategoryList: RoomCategoryDO[];
	private _yieldFilterVMValues: YieldFilterValueVM[];

	constructor(private _thTranslation: ThTranslation) {
	}

	public initFromTaxes(taxContainer: TaxContainerDO) {
		this._vatTax = _.find(taxContainer.vatList, (vatTax: TaxDO) => {
			var foundTaxId: string = _.find(this._priceProduct.taxIdList, (taxId: string) => {
				return taxId === vatTax.id;
			});
			return foundTaxId != null;
		});
		this._otherTaxList = _.filter(taxContainer.otherTaxList, (otherTax: TaxDO) => {
			return _.contains(this._priceProduct.taxIdList, otherTax.id);
		});
	}
	public initFromRoomCategoryList(roomCategoryList: RoomCategoryDO[]) {
		this._roomCategoryList = _.filter(roomCategoryList, (roomCategory: RoomCategoryDO) => {
			return _.contains(this._priceProduct.roomCategoryIdList, roomCategory.id);
		});
	}
	public initFromYieldFilters(yieldFilters: YieldFiltersDO) {
		this._yieldFilterVMValues = [];
		_.forEach(yieldFilters.yieldFilterList, (yieldFilter: YieldFilterDO) => {
			var foundFilter: PriceProductYieldFilterMetaDO = _.find(this._priceProduct.yieldFilterList, (filter: PriceProductYieldFilterMetaDO) => {
				return filter.filterId === yieldFilter.id;
			});
			var filterValueVM = new YieldFilterValueVM();
			filterValueVM.filterId = yieldFilter.id;

			if (!foundFilter) {
				this._yieldFilterVMValues.push(filterValueVM);
				return;
			}
			var foundFilterValue: YieldFilterValueDO = _.find(yieldFilter.values, (filterValue: YieldFilterValueDO) => {
				return filterValue.id === foundFilter.valueId;
			});
			if (!foundFilterValue) {
				this._yieldFilterVMValues.push(filterValueVM);
				return;
			}
			filterValueVM.yieldFilterValue = foundFilterValue;
			this._yieldFilterVMValues.push(filterValueVM);
		});
	}

	public get priceProduct(): PriceProductDO {
		return this._priceProduct;
	}
	public set priceProduct(priceProduct: PriceProductDO) {
		this._priceProduct = priceProduct;
	}
	public get vatTax(): TaxDO {
		return this._vatTax;
	}
	public set vatTax(vatTax: TaxDO) {
		this._vatTax = vatTax;
		this.updateTaxIdListOnPriceProductDO();
	}
	public get otherTaxList(): TaxDO[] {
		return this._otherTaxList;
	}
	public set otherTaxList(otherTaxList: TaxDO[]) {
		this._otherTaxList = otherTaxList;
		this.updateTaxIdListOnPriceProductDO();
	}
	private updateTaxIdListOnPriceProductDO() {
		this._priceProduct.taxIdList = [];
		if (this.vatTax) {
			this._priceProduct.taxIdList.push(this.vatTax.id);
		}
		this._priceProduct.taxIdList.concat(_.map(this._otherTaxList, (otherTax: TaxDO) => { return otherTax.id }));
	}

	public get roomCategoryList(): RoomCategoryDO[] {
		return this._roomCategoryList;
	}
	public set roomCategoryList(roomCategoryList: RoomCategoryDO[]) {
		this._roomCategoryList = roomCategoryList;
		this._priceProduct.roomCategoryIdList = _.map(roomCategoryList, (roomCategory: RoomCategoryDO) => { return roomCategory.id });
	}
	public get yieldFilterVMValues(): YieldFilterValueVM[] {
		return this._yieldFilterVMValues;
	}
	public set yieldFilterVMValues(yieldFilterVMValues: YieldFilterValueVM[]) {
		this._yieldFilterVMValues = yieldFilterVMValues;
	}

	public updateYieldFilterValueVM(filterValueVM: YieldFilterValueVM) {
		this._yieldFilterVMValues = _.reject(this._yieldFilterVMValues, (yieldFilterValue: YieldFilterValueVM) => {
			return yieldFilterValue.filterId === filterValueVM.filterId;
		});
		this._yieldFilterVMValues.push(filterValueVM);
		this.updateYieldFilterValuesOnPriceProductDO();
		this.updateYieldFilterValuesOnPriceProductDO();
	}
	private updateYieldFilterValuesOnPriceProductDO() {
		this._priceProduct.yieldFilterList = [];
		_.forEach(this._yieldFilterVMValues, (yieldFilterValue: YieldFilterValueVM) => {
			if (!yieldFilterValue.yieldFilterValue || !yieldFilterValue.yieldFilterValue.id) {
				return;
			}
			var ppFilter = new PriceProductYieldFilterMetaDO();
			ppFilter.filterId = yieldFilterValue.filterId;
			ppFilter.valueId = yieldFilterValue.yieldFilterValue.id;
			this._priceProduct.yieldFilterList.push(ppFilter);
		});
	}
	public getFilterValue(filterId: string): YieldFilterValueDO {
		var filterValueVM: YieldFilterValueVM = _.find(this._yieldFilterVMValues, (filterVMValue: YieldFilterValueVM) => {
			return filterVMValue.filterId === filterId;
		});
		return filterValueVM.yieldFilterValue;
	}

	public get availabilityString(): string {
		switch (this._priceProduct.availability) {
			case PriceProductAvailability.Confidential:
				return "Confidential";
			default:
				return "Public";
		}
	}
	public get priceTypeString(): string {
		switch (this._priceProduct.price.type) {
			case PriceProductPriceType.PricePerPerson:
				return "Price Per Person";
			default:
				return "Single Price";
		}
	}
	public get roomCategoriesString(): string {
		var roomCategoriesString: string = "";
		_.forEach(this._roomCategoryList, (roomCategory: RoomCategoryDO) => {
			if (roomCategoriesString.length > 0) {
				roomCategoriesString += ", ";
			}
			roomCategoriesString += roomCategory.displayName;
		});
		return roomCategoriesString;
	}
	public get cancellationConditionsString(): string {
		var policyDesc = this._priceProduct.conditions.policy.getDescription();
		var description = this._thTranslation.translate(policyDesc.phrase, policyDesc.parameters);
		var penaltyDesc = this._priceProduct.conditions.penalty.getDescription();
		description += " / " + this._thTranslation.translate(penaltyDesc.phrase, penaltyDesc.parameters);
		return description;
	}

	public buildPrototype(): PriceProductVM {
		var copy = new PriceProductVM(this._thTranslation);
		copy.priceProduct = new PriceProductDO();
		copy.priceProduct.buildFromObject(this.priceProduct);
		copy.vatTax = this.vatTax;
		copy.otherTaxList = this.otherTaxList;
		copy.roomCategoryList = this.roomCategoryList;
		copy.yieldFilterVMValues = this.yieldFilterVMValues;
		return copy;
	}
}