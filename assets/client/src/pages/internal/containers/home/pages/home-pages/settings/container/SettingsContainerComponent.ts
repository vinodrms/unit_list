import {Component, OnInit} from '@angular/core';
import {SettingsNavbarService} from '../subcomponents/navbar/services/SettingsNavbarService';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

@Component({
	selector: 'settings-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/container/template/settings-container.html'
})
export class SettingsContainerComponent extends AHomeContainerComponent implements OnInit {

	constructor(private _navbarService: SettingsNavbarService,
		headerPageService: HeaderPageService) {
		super(headerPageService, HeaderPageType.None);
	}

	ngOnInit() {
	}

	public get pageName(): string {
		return this._navbarService.getSelectedPage().pageName;
	}
	public get iconFontName(): string {
		return this._navbarService.getSelectedPage().iconFontName;
	}
	public get numberOfItemsString(): string {
		var numberOfItems = this._navbarService.numberOfItems;
		if (numberOfItems < 0) {
			return "";
		}
		return numberOfItems + "";
	}
}