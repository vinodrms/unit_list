import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {YieldFilterModalComponent} from '../YieldFilterModalComponent';
import {YieldFilterModalInput} from './utils/YieldFilterModalInput';
import {YieldFilterDO} from '../../../../../../services/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../../../../../services/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFiltersService} from '../../../../../../services/hotel-configurations/YieldFiltersService';

@Injectable()
export class YieldFilterModalService {
	constructor(private _appContext: AppContext) { }

	public openYieldFilterModal(yieldFilterService: YieldFiltersService, yieldFilter: YieldFilterDO): Promise<ModalDialogRef<YieldFilterValueDO>> {
		var yieldFilterModalInput = new YieldFilterModalInput();
		yieldFilterModalInput.yieldFilterService = yieldFilterService;
		yieldFilterModalInput.yieldFilter = yieldFilter;

		return this._appContext.modalService.open<any>(<any>YieldFilterModalComponent, ReflectiveInjector.resolve([
			provide(YieldFilterModalInput, { useValue: yieldFilterModalInput })
		]));
	}
}