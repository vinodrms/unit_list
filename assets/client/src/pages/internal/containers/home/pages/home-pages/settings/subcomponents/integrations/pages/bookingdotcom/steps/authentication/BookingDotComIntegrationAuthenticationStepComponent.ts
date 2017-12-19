import { Component, OnInit } from '@angular/core';
import { BookingDotComIntegrationAuthenticationStepService } from './service/BookingDotComIntegrationAuthenticationStepService';
import { FormGroup } from '@angular/forms';
import { AppContext } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BaseFormComponent } from '../../../../../../../../../../../../../common/base/BaseFormComponent';
import { GetBookingDotComConfigurationService } from '../../services/GetBookingDotComConfigurationService';
import { BookingDotComConfigurationDO } from '../../services/utils/BookingDotComConfigurationDO';

@Component({
	selector: 'booking-dot-com-integration-authentication-step',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/steps/authentication/template/booking-dot-com-integration-authentication-step.html',
	providers: [BookingDotComIntegrationAuthenticationStepService, GetBookingDotComConfigurationService]
})
export class BookingDotComIntegrationAuthenticationStepComponent extends BaseFormComponent implements OnInit {

	public isSaving: boolean = false;
	public isLoading: boolean = true;
	
	constructor(
		private appContext: AppContext,
		private bookingDotComIntegrationService: BookingDotComIntegrationAuthenticationStepService,
		private getBookingDotComConfigurationService: GetBookingDotComConfigurationService) {
		super();
    }
    
	ngOnInit() {
		this.isLoading = true;
		this.getBookingDotComConfigurationService.getConfiguration().subscribe((configuration: BookingDotComConfigurationDO) => {
			this.bookingDotComIntegrationService.updateFormValues(configuration.authentication);
			this.isLoading = false;
		});
	}

	protected getDefaultFormGroup(): FormGroup {
		return this.bookingDotComIntegrationService.form;
	}

	public saveAuthenticationData() {
		if (this.isSaving) { return; }
		this.isSaving = true;
		this.bookingDotComIntegrationService.saveForm().subscribe((result: any) => {
			this.isSaving = false;
			this.appContext.toaster.success(this.appContext.thTranslation.translate("Information Saved Succesfully"));
		}, (error: any) => {
			this.isSaving = false;
			this.appContext.toaster.error(this.appContext.thTranslation.translate("Error Saving Information"));						
		});
	}
}