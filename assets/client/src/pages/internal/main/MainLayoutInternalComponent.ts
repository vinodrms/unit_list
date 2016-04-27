import {Component, Inject, ViewContainerRef} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
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
	directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
	{ path: '/...', name: 'MainHomeComponent', component: MainHomeComponent, useAsDefault: true },
	{ path: '/wizard/...', name: 'MainWizardComponent', component: MainWizardComponent }
])

export class MainLayoutInternalComponent extends BaseComponent {
	constructor(viewContainerRef: ViewContainerRef, @Inject(IToaster) toaster: IToaster, @Inject(IModalService) modalService: IModalService) {
		super();
		toaster.bootstrap(viewContainerRef);
		modalService.bootstrap(viewContainerRef);
	}
}