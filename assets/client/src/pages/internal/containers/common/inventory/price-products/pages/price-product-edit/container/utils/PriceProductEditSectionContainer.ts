import {IPriceProductEditSection} from '../../sections/utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {AddOnProductCategoriesDO} from '../../../../../../../../services/settings/data-objects/AddOnProductCategoriesDO';

import * as _ from "underscore";

export class PriceProductEditSectionContainer implements IPriceProductEditSection {
	private _priceProductEditSectionList: IPriceProductEditSection[];

	constructor(priceProductEditSectionList: IPriceProductEditSection[]) {
		this._priceProductEditSectionList = priceProductEditSectionList;
	}

	public get priceProductEditSectionList(): IPriceProductEditSection[] {
		return this._priceProductEditSectionList;
	}
	public set priceProductEditSectionList(priceProductEditSectionList: IPriceProductEditSection[]) {
		this._priceProductEditSectionList = priceProductEditSectionList;
	}

	public get readonly(): boolean {
		return true;
	}
	public set readonly(readonly: boolean) {
		_.forEach(this._priceProductEditSectionList, (section: IPriceProductEditSection) => {
			section.readonly = readonly;
		});
	}
	public isValid(): boolean {
		var isValid = true;
		_.forEach(this._priceProductEditSectionList, (section: IPriceProductEditSection) => {
			isValid = section.isValid() ? isValid : false;
		});
		return isValid;
	}
	public initializeFrom(priceProductVM: PriceProductVM, addOnProductCategories: AddOnProductCategoriesDO) {
		_.forEach(this._priceProductEditSectionList, (section: IPriceProductEditSection) => {
			section.initializeFrom(priceProductVM, addOnProductCategories);
		});
	}
	public updateDataOn(priceProductVM: PriceProductVM) {
		_.forEach(this._priceProductEditSectionList, (section: IPriceProductEditSection) => {
			if (!section.readonly) {
				section.updateDataOn(priceProductVM);
			}
		});
	}
}