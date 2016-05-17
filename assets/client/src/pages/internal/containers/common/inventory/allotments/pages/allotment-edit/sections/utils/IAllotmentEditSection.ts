import {AllotmentVM} from '../../../../../../../../services/allotments/view-models/AllotmentVM';

export interface IAllotmentEditSection {
	readonly: boolean;
	isValid(): boolean;
	initializeFrom(allotmentVM: AllotmentVM);
	updateDataOn(allotmentVM: AllotmentVM);
}