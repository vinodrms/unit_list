import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {TaxListModalComponent} from '../TaxListModalComponent';
import {TaxListModalModule} from '../TaxListModalModule';
import {TaxListModalInput} from './utils/TaxListModalInput';
import {TaxDO, TaxType} from '../../../../../../services/taxes/data-objects/TaxDO';

@Injectable()
export class TaxListModalService {

	constructor(private _appContext: AppContext) { }

	public openTaxListModal(taxType: TaxType): Promise<ModalDialogRef<TaxDO[]>> {
		var taxListModalInput = new TaxListModalInput();
		taxListModalInput.taxType = taxType;

		return this._appContext.modalService.open<any>(TaxListModalModule, TaxListModalComponent, ReflectiveInjector.resolve([
			{ provide: TaxListModalInput, useValue: taxListModalInput }
		]));
	}
}