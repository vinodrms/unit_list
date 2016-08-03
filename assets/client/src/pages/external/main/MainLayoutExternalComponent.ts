import {Inject, Component, ViewContainerRef} from '@angular/core';
import {provideRouter, RouterConfig, ROUTER_DIRECTIVES} from '@angular/router';

import {BaseComponent} from '../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../common/utils/localization/TranslationPipe';
import {IToaster} from '../../../common/utils/toaster/IToaster';
import {IModalService} from '../../../common/utils/modals/IModalService';
import {CustomScroll} from '../../../common/utils/directives/CustomScroll';

import {LogInComponent} from '../pages/log-in/LogInComponent';
import {ResetPasswordComponent} from '../pages/reset-password/ResetPasswordComponent';
import {UpdatePasswordComponent} from '../pages/update-password/UpdatePasswordComponent';
import {SignUpComponent} from '../pages/sign-up/SignUpComponent';

@Component({
    selector: 'main-layout-external',
    templateUrl: '/client/src/pages/external/main/template/main-layout-external.html',
	directives: [ROUTER_DIRECTIVES, CustomScroll],
	pipes: [TranslationPipe],
	precompile: [LogInComponent, ResetPasswordComponent, UpdatePasswordComponent, SignUpComponent]
})
export class MainLayoutExternalComponent extends BaseComponent {
	constructor(viewContainerRef: ViewContainerRef, @Inject(IToaster) toaster: IToaster, @Inject(IModalService) modalService: IModalService) {
		super();
		toaster.bootstrap(viewContainerRef);
		modalService.bootstrap(viewContainerRef);
	}
}