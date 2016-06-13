import {AllotmentDO} from '../../../../data-objects/AllotmentDO';

export class AllotmentRepositoryHelper {
	public buildAllotmentDOFrom(dbAllotment: Object): AllotmentDO {
		var allotment: AllotmentDO = new AllotmentDO();
		allotment.buildFromObject(dbAllotment);
		return allotment;
	}
	public buildAllotmentListFrom(dbAllotmentList: Array<Object>): AllotmentDO[] {
		var list: AllotmentDO[] = [];
		dbAllotmentList.forEach((dbAllotment: Object) => {
			list.push(this.buildAllotmentDOFrom(dbAllotment));
		});
		return list;
	}
}