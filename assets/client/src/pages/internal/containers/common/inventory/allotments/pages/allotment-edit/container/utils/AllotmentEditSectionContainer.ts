import {IAllotmentEditSection} from '../../sections/utils/IAllotmentEditSection';
import {AllotmentVM} from '../../../../../../../../services/allotments/view-models/AllotmentVM';

export class AllotmentEditSectionContainer implements IAllotmentEditSection {
	private _allotmentEditSectionList: IAllotmentEditSection[];

	constructor(allotmentEditSectionList: IAllotmentEditSection[]) {
		this._allotmentEditSectionList = allotmentEditSectionList;
	}

	public get allotmentEditSectionList(): IAllotmentEditSection[] {
		return this._allotmentEditSectionList;
	}
	public set allotmentEditSectionList(allotmentEditSectionList: IAllotmentEditSection[]) {
		this._allotmentEditSectionList = allotmentEditSectionList;
	}
	public get readonly(): boolean {
		return true;
	}
	public set readonly(readonly: boolean) {
		_.forEach(this._allotmentEditSectionList, (section: IAllotmentEditSection) => {
			section.readonly = readonly;
		});
	}
	public isValid(): boolean {
		var isValid = true;
		_.forEach(this._allotmentEditSectionList, (section: IAllotmentEditSection) => {
			isValid = section.isValid() ? isValid : false;
		});
		return isValid;
	}
	public initializeFrom(allotmentVM: AllotmentVM) {
		_.forEach(this._allotmentEditSectionList, (section: IAllotmentEditSection) => {
			section.initializeFrom(allotmentVM);
		});
	}
	public updateDataOn(allotmentVM: AllotmentVM) {
		_.forEach(this._allotmentEditSectionList, (section: IAllotmentEditSection) => {
			if (!section.readonly) {
				section.updateDataOn(allotmentVM);
			}
		});
	}
}