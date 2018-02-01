import { Component, OnInit } from '@angular/core';
import { SettingsIntegrationsPagesService } from '../../main/services/SettingsIntegrationsPagesService';
import { IntegrationType } from '../../utils/IntegrationType';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { GetBookingDotComConfigurationService } from './services/GetBookingDotComConfigurationService';
import { BookingDotComConfigurationDO } from './services/utils/BookingDotComConfigurationDO';
import { EnableBookingDotComIntegrationService } from './services/EnableBookingDotComIntegrationService';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

enum IntegrationStep {
	Authentication,
	HotelConfiguration,
	RoomCategoryConfiguration,
    PriceProductConfiguration,
    Sync
}

@Component({
	selector: 'settings-booking-dot-com-integration',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/template/settings-booking-dot-com-integration.html',
	providers: [GetBookingDotComConfigurationService, EnableBookingDotComIntegrationService]
})
export class SettingsBookingDotComIntegrationComponent extends BaseComponent implements OnInit {

	public isLoading: boolean;
	public _isIntegrationEnabled: boolean;
	public selectedStep: IntegrationStep;
	private enableBookingDotComSubscription: Subscription;

	constructor(
		private appContext: AppContext,
		private pagesService: SettingsIntegrationsPagesService,
		private enableBookingDotComIntegrationService: EnableBookingDotComIntegrationService,
		private getBookingDotComConfigurationService: GetBookingDotComConfigurationService) {
		super();
		this.pagesService.bootstrapSelectedTab(IntegrationType.BookingDotCom);
		this.selectedStep = IntegrationStep.Authentication;
	}
	ngOnInit() {
		this.isLoading = true;
		this.getBookingDotComConfigurationService.getConfiguration().subscribe((configuration: BookingDotComConfigurationDO) => {
			this.isLoading = false;
			this._isIntegrationEnabled = configuration.enabled;
		}, (error: any) => {
			this.isLoading = false;
		});
		this._isIntegrationEnabled = false;
	}

	public set isIntegrationEnabled(value: boolean) {
		this._isIntegrationEnabled = value;
		if (this.enableBookingDotComSubscription) {
			this.enableBookingDotComIntegrationService.refresh(this.isIntegrationEnabled);
			return;
		}
		this.enableBookingDotComSubscription = this.enableBookingDotComIntegrationService.setEnabled(this.isIntegrationEnabled).subscribe((isEnabled: boolean) => {
			this._isIntegrationEnabled = isEnabled;

		}, (error: any) => {
			this._isIntegrationEnabled = false;
		});
	}

	public get isIntegrationEnabled(): boolean {
		return this._isIntegrationEnabled;
	}

	public isAuthenticationStepSelected(): boolean {
		return this.selectedStep === IntegrationStep.Authentication;
	}

	public isHotelConfigurationStepSelected(): boolean {
		return this.selectedStep === IntegrationStep.HotelConfiguration;
	}

	public isRoomCategoryConfigurationStepSelected(): boolean {
		return this.selectedStep === IntegrationStep.RoomCategoryConfiguration;
	}

	public isPriceProductConfigurationStepSelected(): boolean {
		return this.selectedStep === IntegrationStep.PriceProductConfiguration;
	}

    public isSyncStepSelected(): boolean {
		return this.selectedStep === IntegrationStep.Sync;
	}

	public selectAuthenticationStep() {
		this.selectedStep = IntegrationStep.Authentication;
	}

	public selectRoomCategoryConfigurationStep() {
		this.selectedStep = IntegrationStep.RoomCategoryConfiguration;
	}

	public selectPriceProductConfigurationStep() {
		this.selectedStep = IntegrationStep.PriceProductConfiguration;
	}

	public selectHotelConfigurationStep() {
		this.selectedStep = IntegrationStep.HotelConfiguration;
    }

    public selectSyncStep() {
		this.selectedStep = IntegrationStep.Sync;
	}
}
