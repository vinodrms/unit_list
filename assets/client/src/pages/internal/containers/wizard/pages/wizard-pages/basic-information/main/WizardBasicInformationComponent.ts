import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {WizardBasicInfoIntroComponent} from '../pages/intro/WizardBasicInfoIntroComponent';
import {WizardBasicInfoNameAddressComponent} from '../pages/name-address/WizardBasicInfoNameAddressComponent';
import {HotelAmenitiesService} from '../../../../../../services/settings/HotelAmenitiesService';
import {HotelPaymentMethodsService} from '../../../../../../services/settings/HotelPaymentMethodsService';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {HotelAggregatorService} from '../../../../../../services/hotel/HotelAggregatorService';

@RouteConfig([
	{ path: '/intro', name: 'WizardBasicInfoIntroComponent', component: WizardBasicInfoIntroComponent, useAsDefault: true },
	{ path: '/name-address', name: 'WizardBasicInfoNameAddressComponent', component: WizardBasicInfoNameAddressComponent }

])
@Component({
	selector: 'wizard-basic-information',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/main/template/wizard-basic-information.html',
	directives: [RouterOutlet],
	providers: [HotelAmenitiesService, HotelPaymentMethodsService, HotelService, HotelAggregatorService]
})
export class WizardBasicInformationComponent extends BaseComponent {
	constructor() {
		super();
	}
}