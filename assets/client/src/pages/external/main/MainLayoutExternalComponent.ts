import {Inject, Component, ViewContainerRef} from '@angular/core';
import {COMPILER_PROVIDERS} from '@angular/compiler';

import {BaseComponent} from '../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../common/utils/localization/TranslationPipe';
import {IToaster} from '../../../common/utils/toaster/IToaster';
import {IModalService} from '../../../common/utils/modals/IModalService';
import {CustomScroll} from '../../../common/utils/directives/CustomScroll';

import {LogInComponent} from '../pages/log-in/LogInComponent';
import {ResetPasswordComponent} from '../pages/reset-password/ResetPasswordComponent';
import {UpdatePasswordComponent} from '../pages/update-password/UpdatePasswordComponent';
import {SignUpComponent} from '../pages/sign-up/SignUpComponent';
import {ModuleLoaderService} from '../../../common/utils/module-loader/ModuleLoaderService';

@Component({
    selector: 'main-layout-external',
    templateUrl: '/client/src/pages/external/main/template/main-layout-external.html',
	entryComponents: [LogInComponent, ResetPasswordComponent, UpdatePasswordComponent, SignUpComponent],
	providers: [COMPILER_PROVIDERS, ModuleLoaderService]
})
export class MainLayoutExternalComponent extends BaseComponent {
	constructor(viewContainerRef: ViewContainerRef,
		@Inject(IToaster) toaster: IToaster,
		@Inject(IModalService) modalService: IModalService,
		moduleLoaderService: ModuleLoaderService) {
		super();
		toaster.bootstrap(viewContainerRef, moduleLoaderService);
		modalService.bootstrap(viewContainerRef, moduleLoaderService);
	}
}