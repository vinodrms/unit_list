import {Component, Inject, ViewContainerRef} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {COMPILER_PROVIDERS} from '@angular/compiler';

import {BaseComponent} from '../../../common/base/BaseComponent';
import {IToaster} from '../../../common/utils/toaster/IToaster';
import {IModalService} from '../../../common/utils/modals/IModalService';
import {MainHomeComponent} from '../containers/home/main/MainHomeComponent';
import {MainWizardComponent} from '../containers/wizard/main/MainWizardComponent';
import {ComponentLoaderService} from '../../../common/utils/components/services/ComponentLoaderService';

@Component({
    selector: 'main-layout-internal',
    template: `
		<router-outlet></router-outlet>
	`,
	directives: [ROUTER_DIRECTIVES],
	entryComponents: [MainHomeComponent, MainWizardComponent],
	providers: [COMPILER_PROVIDERS, ComponentLoaderService]
})
export class MainLayoutInternalComponent extends BaseComponent {
	constructor(viewContainerRef: ViewContainerRef,
		@Inject(IToaster) toaster: IToaster,
		@Inject(IModalService) modalService: IModalService,
		componentLoaderService: ComponentLoaderService) {
		super();
		toaster.bootstrap(viewContainerRef, componentLoaderService);
		modalService.bootstrap(viewContainerRef, componentLoaderService);
	}
}