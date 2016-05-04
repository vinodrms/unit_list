import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {PriceProductConstraintModalComponent} from '../PriceProductConstraintModalComponent';
import {PriceProductConstraintDO} from '../../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintDO';

@Injectable()
export class PriceProductConstraintModalService {
	constructor(private _appContext: AppContext) { }

	public openPriceProductConstraintsModal(): Promise<ModalDialogRef<PriceProductConstraintDO>> {
		return this._appContext.modalService.open<any>(<any>PriceProductConstraintModalComponent, ReflectiveInjector.resolve([]));
	}
}