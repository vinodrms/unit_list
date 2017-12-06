import { Component, OnInit } from '@angular/core';
import { SettingsIntegrationsPagesService } from '../../main/services/SettingsIntegrationsPagesService';
import { IntegrationType } from '../../utils/IntegrationType';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';

enum IntegrationStep {
	Authentication,
	RoomConfiguration,
	PriceProductConfiguration
}

@Component({
	selector: 'settings-booking-dot-com-integration',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/template/settings-booking-dot-com-integration.html'
})
export class SettingsBookingDotComIntegrationComponent extends BaseComponent implements OnInit {

	public isIntegrationEnabled: boolean;
	public selectedStep: IntegrationStep;

	constructor(
		private _appContext: AppContext,
		private _pagesService: SettingsIntegrationsPagesService) {
		super();
		this._pagesService.bootstrapSelectedTab(IntegrationType.BookingDotCom);
		this.selectedStep = IntegrationStep.Authentication;
	}
	ngOnInit() {
		this.isIntegrationEnabled = false;
	}

	public isAuthenticationStepSelected(): boolean {
		return this.selectedStep === IntegrationStep.Authentication;
	}

	public isRoomConfigurationStepSelected(): boolean {
		return this.selectedStep === IntegrationStep.RoomConfiguration;
	}

	public isPriceProductConfigurationStepSelected(): boolean {
		return this.selectedStep === IntegrationStep.PriceProductConfiguration;
	}

	public selectAuthenticationStep() {
		this.selectedStep = IntegrationStep.Authentication;
	}

	public selectRoomConfigurationStep() {
		this.selectedStep = IntegrationStep.RoomConfiguration;
	}

	public selectPriceProductConfigurationStep() {
		this.selectedStep = IntegrationStep.PriceProductConfiguration;
	}
}