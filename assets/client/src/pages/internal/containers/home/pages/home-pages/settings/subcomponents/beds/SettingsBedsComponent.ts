import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {BedsComponent} from '../../../../../../common/inventory/beds/main/BedsComponent';
import {SettingsNavbarService} from '../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../navbar/services/utils/SettingsPageType';

@Component({
	selector: 'settings-beds',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/beds/template/settings-beds.html',
    directives: [BedsComponent],
	pipes: [TranslationPipe]
})

export class SettingsBedsComponent extends BaseComponent implements OnInit {
	constructor(private _navbarService: SettingsNavbarService) {
		super();
	}
	ngOnInit() {
		this._navbarService.bootstrap(SettingsPageType.Beds);
	}
}