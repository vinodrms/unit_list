import {BaseDO} from '../../../../../common/base/BaseDO';
import {BedTemplateDO} from '../../common/data-objects/bed-template/BedTemplateDO';

export class BedTemplatesDO extends BaseDO {
	bedTemplateList: BedTemplateDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.bedTemplateList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "bedTemplateList"), (bedTemplateObject: Object) => {
			var bedTemplateDO = new BedTemplateDO();
			bedTemplateDO.buildFromObject(bedTemplateObject);
			this.bedTemplateList.push(bedTemplateDO);
		});
	}
}