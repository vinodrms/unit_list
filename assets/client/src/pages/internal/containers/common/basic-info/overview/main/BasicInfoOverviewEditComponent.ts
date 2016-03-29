import {Component, OnInit} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import {BaseFormComponent} from '../../../../../../../common/base/BaseFormComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../common/utils/components/LoadingComponent';
import {ImageUploadComponent} from '../../../../../../../common/utils/components/ImageUploadComponent';
import {VATComponent, VatDetails, VatResponse} from '../../../../../../../common/utils/components/VATComponent';
import {CountriesService} from '../../../../../services/settings/CountriesService';
import {CountriesDO} from '../../../../../services/settings/data-objects/CountriesDO';
import {HotelAggregatorService} from '../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../services/hotel/utils/HotelAggregatedInfo';
import {BasicInfoOverviewEditService} from './services/BasicInfoOverviewEditService';

@Component({
	selector: 'basic-info-overview-edit',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/overview/main/template/basic-info-overview-edit.html',
	directives: [LoadingComponent, ImageUploadComponent, VATComponent],
	providers: [],
	pipes: [TranslationPipe]
})

export class BasicInfoOverviewEditComponent extends BaseFormComponent implements OnInit {
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
		Observable.zip(
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
		this._overviewEditService.initForm(this.countries, this.hotelInfo);
	}
	protected getDefaultControlGroup(): ControlGroup {
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
}