import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../common/base/BaseComponent';
import { SettingsNavbarService } from '../../navbar/services/SettingsNavbarService';
import { SettingsPageType } from '../../navbar/services/utils/SettingsPageType';
import { SettingsIntegrationsPageVM } from './services/utils/SettingsIntegrationsPageVM';
import { SettingsIntegrationsPagesService } from './services/SettingsIntegrationsPagesService';

@Component({
	selector: 'settings-integrations',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/main/template/settings-integrations.html',
	providers: [SettingsIntegrationsPagesService]
})
export class SettingsIntegrationsComponent extends BaseComponent {
	constructor(private _navbarService: SettingsNavbarService,
		private _integrationsService: SettingsIntegrationsPagesService,
		) {
		super();
		this._navbarService.bootstrap(SettingsPageType.Integrations);
	}

	public get integrationsPageList(): SettingsIntegrationsPageVM[] {
		return this._integrationsService.integrationsPageList;
	}

	public changePage(integrationPage: SettingsIntegrationsPageVM) {
		this._integrationsService.changePage(integrationPage);
	}
}