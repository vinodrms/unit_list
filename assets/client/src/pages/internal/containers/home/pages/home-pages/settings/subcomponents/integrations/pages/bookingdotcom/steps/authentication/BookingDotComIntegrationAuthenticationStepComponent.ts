import { Component, OnInit } from '@angular/core';
import { BookingDotComIntegrationAuthenticationStepService } from './service/BookingDotComIntegrationAuthenticationStepService';
import { FormGroup } from '@angular/forms';
import { AppContext } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BaseFormComponent } from '../../../../../../../../../../../../../common/base/BaseFormComponent';

@Component({
	selector: 'booking-dot-com-integration-authentication-step',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/steps/authentication/template/booking-dot-com-integration-authentication-step.html',
	providers: [BookingDotComIntegrationAuthenticationStepService]
})
export class BookingDotComIntegrationAuthenticationStepComponent extends BaseFormComponent implements OnInit {

	public isSaving: boolean = false;
	
	constructor(
		private appContext: AppContext,
		private bookingDotComIntegrationService: BookingDotComIntegrationAuthenticationStepService) {
		super();
    }
    
	ngOnInit() {
	}

	protected getDefaultFormGroup(): FormGroup {
		return this.bookingDotComIntegrationService.form;
	}
}