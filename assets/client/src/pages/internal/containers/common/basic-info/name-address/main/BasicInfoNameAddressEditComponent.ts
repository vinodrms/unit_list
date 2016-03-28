import {Component, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../common/utils/components/LoadingComponent';
import {ImageUploadComponent} from '../../../../../../../common/utils/components/ImageUploadComponent';
import {CountriesService} from '../../../../../services/settings/CountriesService';
import {CountriesDO} from '../../../../../services/settings/data-objects/CountriesDO';
import {HotelAggregatorService} from '../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../services/hotel/utils/HotelAggregatedInfo';

@Component({
	selector: 'basic-info-name-address-edit',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/name-address/main/template/basic-info-name-address-edit.html',
	directives: [LoadingComponent, ImageUploadComponent],
	pipes: [TranslationPipe]
})

export class BasicInfoNameAddressEditComponent extends BaseComponent implements OnInit {
	isLoading: boolean = true;
	countries: CountriesDO;
	hotelInfo: HotelAggregatedInfo;

	constructor(private _appContext: AppContext,
		private _countriesService: CountriesService,
		private _hotelAggregator: HotelAggregatorService) {
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
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
	}
	
	// TODO
	public didUploadLogo(logoUrl: string) {

	}
}