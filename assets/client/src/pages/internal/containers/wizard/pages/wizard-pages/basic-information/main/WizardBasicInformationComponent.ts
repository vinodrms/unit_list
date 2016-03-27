import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {WizardBasicInfoIntroComponent} from '../pages/intro/WizardBasicInfoIntroComponent';
import {WizardBasicInfoNameAddressComponent} from '../pages/name-address/WizardBasicInfoNameAddressComponent';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../../../../../services/hotel/HotelProviders';

@RouteConfig([
	{ path: '/intro', name: 'WizardBasicInfoIntroComponent', component: WizardBasicInfoIntroComponent, useAsDefault: true },
	{ path: '/name-address', name: 'WizardBasicInfoNameAddressComponent', component: WizardBasicInfoNameAddressComponent }

])
@Component({
	selector: 'wizard-basic-information',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/main/template/wizard-basic-information.html',
	directives: [RouterOutlet],
	providers: [HOTEL_AGGREGATOR_PROVIDERS]
})
export class WizardBasicInformationComponent extends BaseComponent {
	constructor() {
		super();
	}
}