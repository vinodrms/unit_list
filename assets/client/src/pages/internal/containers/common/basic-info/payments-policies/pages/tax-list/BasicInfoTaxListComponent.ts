import {Component, OnInit, Input} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {PercentagePipe} from '../../../../../../../../common/utils/pipes/PercentagePipe';
import {ThError, AppContext} from '../../../../../../../../common/utils/AppContext';
import {TaxService} from '../../../../../../services/taxes/TaxService';
import {TaxContainerDO} from '../../../../../../services/taxes/data-objects/TaxContainerDO';
import {TaxDO, TaxType} from '../../../../../../services/taxes/data-objects/TaxDO';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {HotelDetailsDO} from '../../../../../../services/hotel/data-objects/HotelDetailsDO';
import {ITaxViewer} from './utils/ITaxViewer';
import {TaxViewerFactory} from './utils/TaxViewerFactory';

@Component({
	selector: 'basic-info-tax-list',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/payments-policies/pages/tax-list/template/basic-info-tax-list.html',
	pipes: [TranslationPipe, PercentagePipe]
})

export class BasicInfoTaxListComponent extends BaseComponent implements OnInit {
	private _taxType: TaxType;
	public get taxType(): TaxType {
		return this._taxType;
	}
	@Input()
	public set taxType(taxType: TaxType) {
		this._taxType = taxType;
		this.updateTaxViewer();
	}
	@Input() ccyCode: string;

	title: string = "";
	description: string = "";
	taxList: TaxDO[] = [];
	private _taxViewer: ITaxViewer;

	constructor(private _appContext: AppContext,
		private _taxService: TaxService,
		private _hotelService: HotelService) {
		super();
	}

	ngOnInit() {
		this._taxService.getTaxContainerDO().subscribe((taxContainer: TaxContainerDO) => {
			this.initTaxList(taxContainer);
		});
	}
	private initTaxList(taxesContainer: TaxContainerDO) {
		this.taxList = this._taxViewer.filterTaxes(taxesContainer);
	}
	private updateTaxViewer() {
		var taxViewerFactory = new TaxViewerFactory();
		this._taxViewer = taxViewerFactory.getTaxViewer(this._taxType);
		this.title = this._taxViewer.getName();
		this.description = this._taxViewer.getDescription();
	}

	editTax(taxId: string) {
		// TODO: modal
	}
	addNewTax() {
		var permissionResult = this._taxViewer.canAddNewTax(this.ccyCode);
		if (!permissionResult.result) {
			var errorMsg = this._appContext.thTranslation.translate(permissionResult.error);
			this._appContext.toaster.error(errorMsg);
			return;
		}
		// TODO: modal
	}
}