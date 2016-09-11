import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {WizardBasicInfoIntroService} from './services/WizardBasicInfoIntroService';
import {WizardBasicInformationStateService} from '../../main/services/WizardBasicInformationStateService';
import {HotelService} from '../../../../../../../services/hotel/HotelService';
import {HotelDetailsDO} from '../../../../../../../services/hotel/data-objects/HotelDetailsDO';

@Component({
	selector: 'wizard-basic-info-intro',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/pages/intro/template/wizard-basic-info-intro.html'
})
export class WizardBasicInfoIntroComponent extends BaseComponent {
	private isLoading: boolean = true;
	private fullName: string = "";

	constructor(private _introService: WizardBasicInfoIntroService,
		private _basicInfoStateService: WizardBasicInformationStateService,
		private _hotelService: HotelService) {
		super();
	}
	ngOnInit() {
		this._basicInfoStateService.basicInfoController.bootstrapBasicInfoStepIndex(this._introService.stepIndex);
		this._hotelService.getHotelDetailsDO().subscribe((hotelDetails: HotelDetailsDO) => {
			this.fullName = hotelDetails.user.contactDetails.firstName + " " + hotelDetails.user.contactDetails.lastName;
			this.isLoading = false;
		});
	}
}