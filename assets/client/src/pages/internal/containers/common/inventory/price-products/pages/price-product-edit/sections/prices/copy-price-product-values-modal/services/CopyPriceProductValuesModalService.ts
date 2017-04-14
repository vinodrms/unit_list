import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../../common/utils/AppContext';
import {CopyPriceProductValuesModalComponent} from '../CopyPriceProductValuesModalComponent';
import {CopyPriceProductValuesModalInput} from './utils/CopyPriceProductValuesModalInput';
import {CopyPriceProductValuesModalModule} from '../CopyPriceProductValuesModalModule';
import {RoomCategoryDO} from '../../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';

@Injectable()
export class CopyPriceProductValuesModalService {
	constructor(private _appContext: AppContext) { }
	public openCopyPriceProductValuesModal(roomCategoryList: RoomCategoryDO[]): Promise<any> {
        var copyPriceProductValuesModalInput = new CopyPriceProductValuesModalInput(roomCategoryList);
		return this._appContext.modalService.open<any>(CopyPriceProductValuesModalModule, CopyPriceProductValuesModalComponent, ReflectiveInjector.resolve([
            { provide: CopyPriceProductValuesModalInput, useValue: copyPriceProductValuesModalInput }
		]));
	}
}