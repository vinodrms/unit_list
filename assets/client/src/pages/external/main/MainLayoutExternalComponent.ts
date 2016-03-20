import {Component} from 'angular2/core';
import {BaseComponent} from '../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../common/utils/localization/TranslationPipe';
import {ROUTER_DIRECTIVES, ROUTER_BINDINGS, RouteConfig} from 'angular2/router';
import {LogInComponent} from '../pages/log-in/LogInComponent';

@Component({
    selector: 'main-layout-external',
    templateUrl: '/client/src/pages/external/main/template/main-layout-external.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [TranslationPipe]
})

@RouteConfig([
	{ path: '/', name: 'LogInComponent', component: LogInComponent }
])

export class MainLayoutExternalComponent extends BaseComponent {
	constructor() {
		super();
	}
}