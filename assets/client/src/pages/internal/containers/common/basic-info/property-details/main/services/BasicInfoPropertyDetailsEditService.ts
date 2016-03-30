import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi, ThError} from '../../../../../../../../common/utils/AppContext';

@Injectable()
export class BasicInfoPropertyDetailsEditService {
    constructor(private _appContext: AppContext) {
	}
}