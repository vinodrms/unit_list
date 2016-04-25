import {Injectable, Injector} from 'angular2/core';
import {AppContext} from '../../../../../../../../../../../../common/utils/AppContext';
import {ModalDialogInstance} from '../../../../../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {PriceProductConstraintModalComponent} from '../PriceProductConstraintModalComponent';
import {PriceProductConstraintDO} from '../../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintDO';

@Injectable()
export class PriceProductConstraintModalService {
	constructor(private _appContext: AppContext) { }

	public openPriceProductConstraintsModal(): Promise<ModalDialogInstance<PriceProductConstraintDO>> {
		return this._appContext.modalService.open<any>(<any>PriceProductConstraintModalComponent, Injector.resolve([]));
	}
}