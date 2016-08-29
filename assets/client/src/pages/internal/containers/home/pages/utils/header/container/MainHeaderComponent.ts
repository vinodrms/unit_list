import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {LoginStatusCode} from '../../../../../../../../common/utils/responses/LoginStatusCode';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {HotelDetailsDO} from '../../../../../../services/hotel/data-objects/HotelDetailsDO';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {HeaderPageService} from './services/HeaderPageService';
import {HeaderPage} from './services/HeaderPage';
import {HeaderSettingsComponent} from '../subcomponents/settings/HeaderSettingsComponent';
import {HeaderNotificationsComponent} from '../subcomponents/notifications/HeaderNotificationsComponent';

@Component({
	selector: 'main-header',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/header/container/template/main-header.html',
	directives: [HeaderSettingsComponent, HeaderNotificationsComponent],
	pipes: [TranslationPipe]
})

export class MainHeaderComponent extends BaseComponent implements OnInit {
	hotelName: string = "";

	constructor(private _appContext: AppContext,
		private _hotelService: HotelService,
		private _headerPageService: HeaderPageService) {
		super();
	}
	public ngOnInit() {
		Observable.combineLatest(
			this._hotelService.getHotelDetailsDO()
		).subscribe((result: [HotelDetailsDO]) => {
			this.hotelName = result[0].hotel.contactDetails.name;
		}, (error: ThError) => {
		});
	}


	public get headerPageList(): HeaderPage[] {
		return this._headerPageService.headerPageList;
	}
	public moveToPage(headerPage: HeaderPage) {
		this._headerPageService.goToPage(headerPage.headerPageType);
	}
}