import {Component, Inject, ElementRef} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {BaseComponent} from '../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../common/utils/localization/TranslationPipe';
import {IToaster} from '../../../common/utils/toaster/IToaster';
import {IModalService} from '../../../common/utils/modals/IModalService';

@Component({
    selector: 'main-layout-internal',
    templateUrl: '/client/src/pages/internal/main/template/main-layout-internal.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [TranslationPipe]
})

@RouteConfig([

])

export class MainLayoutInternalComponent extends BaseComponent {
	constructor(elementRef: ElementRef, @Inject(IToaster) toaster: IToaster, @Inject(IModalService) modalService: IModalService) {
		super();
		toaster.bootstrap(elementRef);
		modalService.bootstrap(elementRef);
	}
}