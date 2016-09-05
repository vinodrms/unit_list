import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {BaseComponent} from '../../../../../common/base/BaseComponent';
import {ISocketsService} from '../../../../../common/utils/sockets/ISocketsService';

@Component({
	selector: 'main-home-component',
	templateUrl: '/client/src/pages/internal/containers/home/main/template/main-home-component.html'
})
export class MainHomeComponent extends BaseComponent implements OnDestroy {

	constructor( @Inject(ISocketsService) private _sockets: ISocketsService) {
		super();

		this._sockets.init();
	}

	public ngOnDestroy() {
		this._sockets.release();
	}
}