import {Component, Inject, ViewContainerRef} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {BaseComponent} from '../../../common/base/BaseComponent';
import {IToaster} from '../../../common/utils/toaster/IToaster';
import {IModalService} from '../../../common/utils/modals/IModalService';
import {MainHomeComponent} from '../containers/home/main/MainHomeComponent';
import {MainWizardComponent} from '../containers/wizard/main/MainWizardComponent';

@Component({
    selector: 'main-layout-internal',
    template: `
		<router-outlet></router-outlet>
	`,
	directives: [ROUTER_DIRECTIVES],
	precompile: [MainHomeComponent, MainWizardComponent]
})
export class MainLayoutInternalComponent extends BaseComponent {
	constructor(viewContainerRef: ViewContainerRef, @Inject(IToaster) toaster: IToaster, @Inject(IModalService) modalService: IModalService) {
		super();
		toaster.bootstrap(viewContainerRef);
		modalService.bootstrap(viewContainerRef);
	}
}