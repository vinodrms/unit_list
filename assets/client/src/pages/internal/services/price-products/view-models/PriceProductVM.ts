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
import {CurrencyDO} from '../../common/data-objects/currency/CurrencyDO';
import {AddOnProductDO} from '../../add-on-products/data-objects/AddOnProductDO';

export class PriceProductVM {
	private _priceProduct: PriceProductDO;
	private _vatTax: TaxDO;
	private _otherTaxList: TaxDO[];
	private _roomCategoryList: RoomCategoryDO[];
	private _yieldFilterVMValues: YieldFilterValueVM[];
	private _ccy: CurrencyDO;
	private _addOnProductList: AddOnProductDO[];

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
		this._yieldFilterVMValues = YieldFilterValueVM.buildYieldFilterValueVMList(yieldFilters, this.priceProduct.yieldFilterList);
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
	}
	public get otherTaxList(): TaxDO[] {
		return this._otherTaxList;
	}
	public set otherTaxList(otherTaxList: TaxDO[]) {
		this._otherTaxList = otherTaxList;
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
	public get ccy(): CurrencyDO {
		return this._ccy;
	}
	public set ccy(ccy: CurrencyDO) {
		this._ccy = ccy;
	}
	public get addOnProductList(): AddOnProductDO[] {
		return this._addOnProductList;
	}
	public set addOnProductList(addOnProductList: AddOnProductDO[]) {
		this._addOnProductList = addOnProductList;
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