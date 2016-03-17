import {Component, Inject, provide} from 'angular2/core';
import {BaseComponent} from '../../../common/components/BaseComponent';
import {HTTP_PROVIDERS} from 'angular2/http';
import {IThHttp} from '../../../common/utils/http/IThHttp';
import {ThHttp} from '../../../common/utils/http/ThHttp';
import {TranslationService} from '../../../common/utils/localization/TranslationService';
import {TranslatePipe} from '../../../common/utils/localization/TranslatePipe';

@Component({
    selector: 'main-layout-external',
    templateUrl: '/client/src/pages/external/main/template/main-layout-external.html',
    directives: [],
    providers: [HTTP_PROVIDERS, provide(IThHttp, { useClass: ThHttp })],
	pipes: [TranslatePipe]
})

export class MainLayoutExternalComponent extends BaseComponent {
	// TODO: remove
	name = "Ionut Paraschiv";

	constructor( @Inject(IThHttp) thHttp: IThHttp, private trServ: TranslationService) {
		super();
	}

	// TODO: remove (translation testing purposes only)
	updatelang() {
		this.trServ.locale = 1 - this.trServ.locale;
	}
}