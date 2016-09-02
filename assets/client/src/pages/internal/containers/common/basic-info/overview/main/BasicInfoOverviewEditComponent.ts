import {Component, OnInit, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseFormComponent} from '../../../../../../../common/base/BaseFormComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../common/utils/components/LoadingComponent';
import {ImageUploadComponent} from '../../../../../../../common/utils/components/image-upload/ImageUploadComponent';
import {VATComponent, VatDetails, VatResponse} from '../../../../../../../common/utils/components/VATComponent';
import {CountriesService} from '../../../../../services/settings/CountriesService';
import {CountriesDO} from '../../../../../services/settings/data-objects/CountriesDO';
import {HotelAggregatorService} from '../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../services/hotel/utils/HotelAggregatedInfo';
import {BasicInfoOverviewEditService} from './services/BasicInfoOverviewEditService';
import {CustomScroll} from '../../../../../../../common/utils/directives/CustomScroll';

@Component({
	selector: 'basic-info-overview-edit',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/overview/main/template/basic-info-overview-edit.html',
	directives: [LoadingComponent, CustomScroll, ImageUploadComponent, VATComponent],
	pipes: [TranslationPipe]
})

export class BasicInfoOverviewEditComponent extends BaseFormComponent implements OnInit {
	@Input() canAutoSave: boolean = false;
	isSaving: boolean = false;

	isLoading: boolean = true;
	countries: CountriesDO;
	hotelInfo: HotelAggregatedInfo;

	logoUrl: string;
	vatDetails: VatDetails;

	constructor(private _appContext: AppContext,
		private _countriesService: CountriesService,
		private _hotelAggregator: HotelAggregatorService,
		private _overviewEditService: BasicInfoOverviewEditService) {
		super();
	}

	public ngOnInit() {
		this.isLoading = true;
		Observable.combineLatest(
			this._countriesService.getCountriesDO(),
			this._hotelAggregator.getHotelAggregatedInfo()
		).subscribe((result: [CountriesDO, HotelAggregatedInfo]) => {
			this.countries = result[0];
			this.hotelInfo = result[1];
			this.initDefaults();
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
	}
	private initDefaults() {
		var hotelDO = this.hotelInfo.hotelDetails.hotel;
		this.logoUrl = hotelDO.logoUrl;
		this.vatDetails = {
			countryCode: hotelDO.contactDetails.address.country.code,
			fullVat: hotelDO.contactDetails.vatCode
		}
		this._overviewEditService.updateFormValues(this.countries, this.hotelInfo);
	}
	protected getDefaultFormGroup(): FormGroup {
		return this._overviewEditService.overviewForm;
	}
	protected get didSubmitForm(): boolean {
		return this._overviewEditService.didSubmitForm;
	}

	public didUploadLogo(logoUrl: string) {
		this._overviewEditService.didUpdateLogoUrl(logoUrl);
	}
	public didChangeVatDetails(vatDetails: VatDetails) {
		this._overviewEditService.didChangeVatDetails(vatDetails);
	}
	public didGetVatResponse(vatResponse: VatResponse) {
		this._overviewEditService.didGetVatResponse(vatResponse);
	}

	public saveOverview() {
		this.isSaving = true;
		this._overviewEditService.saveOverview().subscribe((result: any) => {
			this.isSaving = false;
			this._appContext.toaster.success(this._appContext.thTranslation.translate("Information Saved Succesfully"));
		}, (error: any) => {
			this.isSaving = false;
		});
	}
}