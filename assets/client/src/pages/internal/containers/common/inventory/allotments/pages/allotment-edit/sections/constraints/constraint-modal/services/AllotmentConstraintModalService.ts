import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {AllotmentConstraintModalComponent} from '../AllotmentConstraintModalComponent';
import {AllotmentConstraintDO} from '../../../../../../../../../../services/allotments/data-objects/constraint/AllotmentConstraintDO';

@Injectable()
export class AllotmentConstraintModalService {
	constructor(private _appContext: AppContext) { }

	public openAllotmentConstraintsModal(): Promise<ModalDialogRef<AllotmentConstraintDO>> {
		return this._appContext.modalService.open<any>(<any>AllotmentConstraintModalComponent, ReflectiveInjector.resolve([]));
	}
}