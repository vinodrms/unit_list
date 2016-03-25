import {Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {IRouterNavigator} from './IRouterNavigator';

@Injectable()
export class RouterNavigator implements IRouterNavigator {

	constructor(private _router: Router) {
	}

	public navigateTo(componentStackPath: string, params?: Object) {
		if (!params) {
			this._router.navigate([componentStackPath]);
		}
		else {
			this._router.navigate([componentStackPath, params]);
		}
	}
}