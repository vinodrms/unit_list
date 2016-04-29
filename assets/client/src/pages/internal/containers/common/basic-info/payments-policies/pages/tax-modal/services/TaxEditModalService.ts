import {Injectable, ReflectiveInjector, provide} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {TaxEditModalComponent} from '../TaxEditModalComponent';
import {TaxDO, TaxType, TaxValueType} from '../../../../../../../services/taxes/data-objects/TaxDO';
import {TaxEditModalInput} from './utils/TaxEditModalInput';
import {TaxService} from '../../../../../../../services/taxes/TaxService';

@Injectable()
export class TaxEditModalService {
	private _dialogInstance: ModalDialogRef<TaxDO>;

	constructor(private _appContext: AppContext, private _taxService: TaxService) {
	}

	public editTax(tax: TaxDO, ccyCode: string): Promise<ModalDialogRef<TaxDO>> {
		var taxToUpdate = new TaxDO();
		taxToUpdate.buildFromObject(tax);
		return this.showModal(taxToUpdate, ccyCode);
	}
	public addTax(taxType: TaxType, ccyCode: string): Promise<ModalDialogRef<TaxDO>> {
		var taxDO = new TaxDO();
		taxDO.type = taxType;
		taxDO.valueType = TaxValueType.Percentage;
		return this.showModal(taxDO, ccyCode);
	}
	private showModal(taxDO: TaxDO, ccyCode: string): Promise<ModalDialogRef<TaxDO>> {
		var taxModalInput = this.buildTaxModalInput(taxDO, ccyCode);
		return this._appContext.modalService.open<TaxDO>(<any>TaxEditModalComponent, ReflectiveInjector.resolve([
			provide(TaxEditModalInput, { useValue: taxModalInput }),
			provide(TaxService, { useValue: this._taxService })
		]));
	}
	private buildTaxModalInput(taxDO: TaxDO, ccyCode: string): TaxEditModalInput {
		var taxModalInput: TaxEditModalInput = new TaxEditModalInput();
		taxModalInput.ccyCode = ccyCode;
		taxModalInput.taxDO = taxDO;
		return taxModalInput;
	}
	public getTaxDOObservable(): Observable<TaxDO> {
		return this._dialogInstance.resultObservable;
	}
}