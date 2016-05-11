import {ThUtils} from '../../../../../common/utils/ThUtils';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';
import {AllotmentDO} from '../data-objects/AllotmentDO';
import {PriceProductDO} from '../../price-products/data-objects/PriceProductDO';
import {CustomerDO} from '../../customers/data-objects/CustomerDO';
import {RoomCategoryDO} from '../../room-categories/data-objects/RoomCategoryDO';
import {AllotmentConstraintDO} from '../data-objects/constraint/AllotmentConstraintDO';

export class AllotmentVM {
	private _thUtils: ThUtils;
	private _allotment: AllotmentDO;
	private _priceProduct: PriceProductDO;
	private _customer: CustomerDO;
	private _roomCategory: RoomCategoryDO;

	constructor(private _thTranslation: ThTranslation) {
		this._thUtils = new ThUtils();
	}

	public get allotment(): AllotmentDO {
		return this._allotment;
	}
	public set allotment(allotment: AllotmentDO) {
		this._allotment = allotment;
	}
	public get priceProduct(): PriceProductDO {
		return this._priceProduct;
	}
	public set priceProduct(priceProduct: PriceProductDO) {
		this._priceProduct = priceProduct;
	}
	public get customer(): CustomerDO {
		return this._customer;
	}
	public set customer(customer: CustomerDO) {
		this._customer = customer;
	}
	public get roomCategory(): RoomCategoryDO {
		return this._roomCategory;
	}
	public set roomCategory(roomCategory: RoomCategoryDO) {
		this._roomCategory = roomCategory;
	}

	public get constraintsString() {
		var constraintsString = this._thUtils.concatStringsWithComma(
			_.map(this._allotment.constraints.constraintList, (constraint: AllotmentConstraintDO) => {
				return constraint.getValueDisplayString(this._thTranslation);
			})
		);
		if (constraintsString.length == 0) {
			constraintsString = this._thTranslation.translate("No Constraints");
		}
		return constraintsString;
	}

	public buildPrototype(): AllotmentVM {
		var copy = new AllotmentVM(this._thTranslation);
		copy.allotment = new AllotmentDO();
		copy.allotment.buildFromObject(this.allotment);
		copy.priceProduct = this.priceProduct;
		copy.roomCategory = this.roomCategory;
		copy.customer = this.customer;
		return copy;
	}
}