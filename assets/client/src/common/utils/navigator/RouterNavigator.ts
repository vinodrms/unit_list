import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
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