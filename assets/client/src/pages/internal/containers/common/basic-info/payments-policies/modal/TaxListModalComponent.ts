import {Component, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {LoadingComponent} from '../../../../../../../common/utils/components/LoadingComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogInstance} from '../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {PercentagePipe} from '../../../../../../../common/utils/pipes/PercentagePipe';
import {TaxService} from '../../../../../services/taxes/TaxService';
import {TaxDO, TaxType} from '../../../../../services/taxes/data-objects/TaxDO';
import {TaxContainerDO} from '../../../../../services/taxes/data-objects/TaxContainerDO';
import {TaxListModalInput} from './services/utils/TaxListModalInput';
import {HotelService} from '../../../../../services/hotel/HotelService';
import {HotelDetailsDO} from '../../../../../services/hotel/data-objects/HotelDetailsDO';

@Component({
	selector: 'tax-list-modal',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/payments-policies/modal/template/tax-list-modal.html',
	providers: [TaxService, HotelService],
	directives: [LoadingComponent],
	pipes: [TranslationPipe, PercentagePipe]
})
export class TaxListModalComponent extends BaseComponent implements ICustomModalComponent, OnInit {
	isLoading: boolean = true;
	ccyCode: string;
	taxList: TaxDO[];

	private _selectedTax: TaxDO;

	constructor(private _appContext: AppContext,
		private _modalDialogInstance: ModalDialogInstance<TaxDO>,
		private _taxListModalInput: TaxListModalInput,
		private _hotelService: HotelService,
		private _taxService: TaxService) {
		super();
	}

	ngOnInit() {
		Observable.combineLatest(
			this._hotelService.getHotelDetailsDO(),
			this._taxService.getTaxContainerDO()
		).subscribe((result: [HotelDetailsDO, TaxContainerDO]) => {
			this.ccyCode = result[0].hotel.ccyCode;
			switch (this._taxListModalInput.taxType) {
				case TaxType.Vat:
					this.taxList = result[1].vatList;
					break;
				default:
					this.taxList = result[1].otherTaxList;
					break;
			}
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
	}

	public closeDialog() {
		this._modalDialogInstance.closeForced();
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Small;
	}

	public didSelectTax() {
		return this._selectedTax != null;
	}
	public isTaxSelected(taxDO: TaxDO) {
		return this.didSelectTax() && this._selectedTax.id === taxDO.id;
	}
	public selectTax(taxDO: TaxDO) {
		this._selectedTax = taxDO;
	}
	public triggerSelectedTax() {
		if (!this.didSelectTax()) {
			return;
		}
		this._modalDialogInstance.addResult(this._selectedTax);
		this.closeDialog();
	}
}