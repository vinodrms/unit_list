import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {WizardBasicInfoIntroComponent} from '../pages/intro/WizardBasicInfoIntroComponent';
import {WizardBasicInfoOverviewComponent} from '../pages/overview/WizardBasicInfoOverviewComponent';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../../../../../services/hotel/HotelProviders';
import {SETTINGS_PROVIDERS} from '../../../../../../services/settings/SettingsProviders';

@RouteConfig([
	{ path: '/intro', name: 'WizardBasicInfoIntroComponent', component: WizardBasicInfoIntroComponent, useAsDefault: true },
	{ path: '/overview', name: 'WizardBasicInfoOverviewComponent', component: WizardBasicInfoOverviewComponent }

])
@Component({
	selector: 'wizard-basic-information',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/main/template/wizard-basic-information.html',
	directives: [RouterOutlet],
	providers: [SETTINGS_PROVIDERS, HOTEL_AGGREGATOR_PROVIDERS]
})
export class WizardBasicInformationComponent extends BaseComponent {
	constructor() {
		super();
	}
}