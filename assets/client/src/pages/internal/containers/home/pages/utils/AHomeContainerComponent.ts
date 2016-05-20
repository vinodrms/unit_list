import {BaseComponent} from '../../../../../../common/base/BaseComponent';
import {HeaderPageService} from './header/services/HeaderPageService';
import {HeaderPageType} from './header/services/HeaderPageType';

export abstract class AHomeContainerComponent extends BaseComponent {
	constructor(headerPageService: HeaderPageService, headerPageType: HeaderPageType) {
		super();
		headerPageService.markCurrentPage(headerPageType);
	}
}