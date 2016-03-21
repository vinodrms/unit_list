import {Inject, Component, ElementRef} from 'angular2/core';
import {BaseComponent} from '../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../common/utils/localization/TranslationPipe';
import {ROUTER_DIRECTIVES, ROUTER_BINDINGS, RouteConfig} from 'angular2/router';
import {LogInComponent} from '../pages/log-in/LogInComponent';
import {ResetPasswordComponent} from '../pages/reset-password/ResetPasswordComponent';
import {IToaster} from '../../../common/utils/toaster/IToaster';
import {UpdatePasswordComponent} from '../pages/update-password/UpdatePasswordComponent';

@Component({
    selector: 'main-layout-external',
    templateUrl: '/client/src/pages/external/main/template/main-layout-external.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [TranslationPipe]
})

@RouteConfig([
	{ path: '/', name: 'LogInComponent', component: LogInComponent },
	{ path: '/reset', name: 'ResetPasswordComponent', component: ResetPasswordComponent },
	{ path: '/update-password/:activationCode/:email', name: 'UpdatePasswordComponent', component: UpdatePasswordComponent }


])

export class MainLayoutExternalComponent extends BaseComponent {
	constructor(elementRef: ElementRef, @Inject(IToaster) toaster: IToaster) {
		super();
		toaster.bootstrap(elementRef);
	}
}