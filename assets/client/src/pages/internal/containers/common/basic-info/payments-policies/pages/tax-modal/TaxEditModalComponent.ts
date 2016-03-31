import {Component, OnInit, Inject} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingButtonComponent} from '../../../../../../../../common/utils/components/LoadingButtonComponent';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogInstance} from '../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {TaxEditModalInput} from './services/utils/TaxEditModalInput';
import {TaxDO, TaxType, TaxValueType} from '../../../../../../services/taxes/data-objects/TaxDO';
import {TaxService} from '../../../../../../services/taxes/TaxService';

@Component({
	selector: 'tax-edit-modal',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/payments-policies/pages/tax-modal/template/tax-edit-modal.html',
	directives: [LoadingButtonComponent],
	pipes: [TranslationPipe]
})
export class TaxEditModalComponent extends BaseComponent implements ICustomModalComponent {
	didSubmitForm = false;
	isLoading = false;

	ccyCode: string;
	taxDO: TaxDO;

	constructor(
		private _appContext: AppContext,
		private _modalDialogInstance: ModalDialogInstance<TaxDO>,
		private _taxService: TaxService,
		modalInput: TaxEditModalInput) {
		super();
		this.taxDO = modalInput.taxDO;
		this.ccyCode = modalInput.ccyCode;
		this.preprocessTaxValue();
	}
	private preprocessTaxValue() {
		if (this.taxDO.valueType === TaxValueType.Percentage && this.taxDO.value) {
			this.taxDO.value = this.taxDO.value * 100;
		}
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Small;
	}
	public closeDialog() {
		this._modalDialogInstance.closeForced();
	}

	public isVatTax(): boolean {
		return this.taxDO.type === TaxType.Vat;
	}
	public getPercentageTaxValueType(): TaxValueType {
		return TaxValueType.Percentage;
	}
	public getFixedTaxValueType(): TaxValueType {
		return TaxValueType.Fixed;
	}
	public didChangeTaxValueType(newValueType: string) {
		this.taxDO.valueType = parseInt(newValueType);
	}

	public saveTax() {
		this.didSubmitForm = true;
		if (!this.isValidValue() || !this.isValidName()) {
			return;
		}
		var newTax: TaxDO = new TaxDO();
		newTax.buildFromObject(this.taxDO);
		if (newTax.valueType === TaxValueType.Percentage) {
			newTax.value = newTax.value / 100;
		}
		if (!newTax.isValid()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		this.isLoading = true;
		this._taxService.saveTax(newTax).subscribe((updatedTax: TaxDO) => {
			this._modalDialogInstance.addResult(updatedTax);
			this._modalDialogInstance.closeForced();
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(error.message);
		});
	}
	public isValidName(): boolean {
		return this.taxDO.name != null && this.taxDO.name.length > 0;
	}
	public isValidValue(): boolean {
		switch (this.taxDO.valueType) {
			case TaxValueType.Fixed:
				return this.taxDO.value > 0;
			case TaxValueType.Percentage:
				return this.taxDO.value > 0 && this.taxDO.value <= 100;
			default:
				return false;
		}
	}
}