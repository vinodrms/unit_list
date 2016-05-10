import {Inject, Component, ViewContainerRef} from '@angular/core';
import {BaseComponent} from '../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../common/utils/localization/TranslationPipe';
import {ROUTER_DIRECTIVES, RouteConfig} from '@angular/router-deprecated';
import {LogInComponent} from '../pages/log-in/LogInComponent';
import {ResetPasswordComponent} from '../pages/reset-password/ResetPasswordComponent';
import {IToaster} from '../../../common/utils/toaster/IToaster';
import {IModalService} from '../../../common/utils/modals/IModalService';
import {UpdatePasswordComponent} from '../pages/update-password/UpdatePasswordComponent';
import {SignUpComponent} from '../pages/sign-up/SignUpComponent';

@Component({
    selector: 'main-layout-external',
    templateUrl: '/client/src/pages/external/main/template/main-layout-external.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [TranslationPipe]
})

@RouteConfig([
	{ path: '/', name: 'LogInComponent', component: LogInComponent, useAsDefault: true },
	{ path: '/reset', name: 'ResetPasswordComponent', component: ResetPasswordComponent },
	{ path: '/update-password/:activationCode/:email', name: 'UpdatePasswordComponent', component: UpdatePasswordComponent },
	{ path: '/sign-up', name: 'SignUpComponent', component: SignUpComponent }
])

export class MainLayoutExternalComponent extends BaseComponent {
	constructor(viewContainerRef: ViewContainerRef, @Inject(IToaster) toaster: IToaster, @Inject(IModalService) modalService: IModalService) {
		super();
		toaster.bootstrap(viewContainerRef);
		modalService.bootstrap(viewContainerRef);
	}
}