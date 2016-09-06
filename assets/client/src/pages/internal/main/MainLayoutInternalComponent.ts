import {Component, Inject, ViewContainerRef} from '@angular/core';

import {BaseComponent} from '../../../common/base/BaseComponent';
import {IToaster} from '../../../common/utils/toaster/IToaster';
import {IModalService} from '../../../common/utils/modals/IModalService';
import {MainHomeComponent} from '../containers/home/main/MainHomeComponent';
import {MainWizardComponent} from '../containers/wizard/main/MainWizardComponent';
import {ModuleLoaderService} from '../../../common/utils/module-loader/ModuleLoaderService';

@Component({
    selector: 'main-layout-internal',
    template: `
		<router-outlet></router-outlet>
	`,
})
export class MainLayoutInternalComponent extends BaseComponent {
	constructor(viewContainerRef: ViewContainerRef,
		@Inject(IToaster) toaster: IToaster,
		@Inject(IModalService) modalService: IModalService,
		moduleLoaderService: ModuleLoaderService) {
		super();
		toaster.bootstrap(viewContainerRef, moduleLoaderService);
		modalService.bootstrap(viewContainerRef, moduleLoaderService);
	}
}