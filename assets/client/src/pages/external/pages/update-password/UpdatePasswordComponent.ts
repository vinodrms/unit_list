import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AppContext} from '../../../../common/utils/AppContext';
import {ThError} from '../../../../common/utils/responses/ThError';
import {BaseFormComponent} from '../../../../common/base/BaseFormComponent';
import {ExternalFooterComponent} from '../common/footer/ExternalFooterComponent';
import {UpdatePasswordService} from './services/UpdatePasswordService';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {LoginStatusCode} from '../../../../common/utils/responses/LoginStatusCode';
import {LoadingButtonComponent} from '../../../../common/utils/components/LoadingButtonComponent';

@Component({
	selector: 'update-password-component',
	templateUrl: '/client/src/pages/external/pages/update-password/template/update-password-component.html',
	directives: [ROUTER_DIRECTIVES, ExternalFooterComponent, LoadingButtonComponent],
	providers: [UpdatePasswordService],
	pipes: [TranslationPipe]
})

export class UpdatePasswordComponent extends BaseFormComponent implements OnInit, OnDestroy {
	public isLoading: boolean = false;
	private _statusCodeSubscription: Subscription;

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _appContext: AppContext,
		private _updatePasswdService: UpdatePasswordService
	) {
		super();
	}
	ngOnInit() {
		this._statusCodeSubscription = this._activatedRoute.params.subscribe(params => {
			this._updatePasswdService.activationCode = params["activationCode"];
			this._updatePasswdService.email = params["email"];
		});
	}
	ngOnDestroy() {
		this._statusCodeSubscription.unsubscribe();
	}

	protected getDefaultFormGroup(): FormGroup {
		return this._updatePasswdService.updatePasswdForm;
	}


	public updatePassword() {
		this.didSubmitForm = true;
		if (!this._updatePasswdService.isValid()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		this.isLoading = true;
		this._updatePasswdService.updatePassword().subscribe((result: Object) => {
			this.isLoading = false;
			this._appContext.routerNavigator.navigateTo("/login", LoginStatusCode.UpdatePasswordOk);
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(error.message);
		})
	}
}