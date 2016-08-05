import {BaseDO} from '../../../../../common/base/BaseDO';
import {AddOnProductCategoryDO, AddOnProductCategoryType} from '../../common/data-objects/add-on-product/AddOnProductCategoryDO';

export class AddOnProductCategoriesDO extends BaseDO {
	addOnProductCategoryList: AddOnProductCategoryDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.addOnProductCategoryList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "addOnProductCategoryList"), (aopObject: Object) => {
			var aopDO = new AddOnProductCategoryDO();
			aopDO.buildFromObject(aopObject);
			this.addOnProductCategoryList.push(aopDO);
		});
	}
	public getBreakfastCategory(): AddOnProductCategoryDO {
		return _.find(this.addOnProductCategoryList, (aopCateg: AddOnProductCategoryDO) => {
			return aopCateg.type === AddOnProductCategoryType.Breakfast;
		});
	}
	public getAddOnProductCategoryList(): AddOnProductCategoryDO[] {
		return _.filter(this.addOnProductCategoryList, (aopCateg: AddOnProductCategoryDO) => {
			return aopCateg.type !== AddOnProductCategoryType.Breakfast;
		});
	}
	public getCategoryById(categoryId: string): AddOnProductCategoryDO {
		return _.find(this.addOnProductCategoryList, (aopCategory: AddOnProductCategoryDO) => { return aopCategory.id === categoryId });
	}
}