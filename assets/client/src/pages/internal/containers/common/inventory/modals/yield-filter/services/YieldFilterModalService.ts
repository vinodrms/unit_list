import {Injectable, Injector, provide} from 'angular2/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogInstance} from '../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {YieldFilterModalComponent} from '../YieldFilterModalComponent';
import {YieldFilterModalInput} from './utils/YieldFilterModalInput';
import {YieldFilterDO} from '../../../../../../services/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../../../../../services/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFiltersService} from '../../../../../../services/hotel-configurations/YieldFiltersService';

@Injectable()
export class YieldFilterModalService {
	constructor(private _appContext: AppContext) { }

	public openYieldFilterModal(yieldFilterService: YieldFiltersService, yieldFilter: YieldFilterDO): Promise<ModalDialogInstance<YieldFilterValueDO>> {
		var yieldFilterModalInput = new YieldFilterModalInput();
		yieldFilterModalInput.yieldFilterService = yieldFilterService;
		yieldFilterModalInput.yieldFilter = yieldFilter;

		return this._appContext.modalService.open<any>(<any>YieldFilterModalComponent, Injector.resolve([
			provide(YieldFilterModalInput, { useValue: yieldFilterModalInput })
		]));
	}
}