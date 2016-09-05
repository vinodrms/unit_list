import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {RoomCategoriesModalComponent} from '../RoomCategoriesModalComponent';
import {RoomCategoriesModalModule} from '../RoomCategoriesModalModule';
import {RoomCategoriesModalInput} from './utils/RoomCategoriesModalInput';
import {RoomCategoryDO} from '../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {RoomCategoriesType} from '../../../../../../services/room-categories/RoomCategoriesType';

@Injectable()
export class RoomCategoriesModalService {

	constructor(private _appContext: AppContext) { }

	public openAllCategoriesModal(allowCategoryEdit: boolean, initialRoomCategoryId?: string): Promise<ModalDialogRef<RoomCategoryDO[]>> {
		var roomCategInput = new RoomCategoriesModalInput();
		roomCategInput.allowCategoryEdit = allowCategoryEdit;
		roomCategInput.initialRoomCategoryId = initialRoomCategoryId;
		roomCategInput.roomCategoriesType = RoomCategoriesType.AllCategories;
		roomCategInput.allowMultiSelection = false;

		return this._appContext.modalService.open<any>(RoomCategoriesModalModule, RoomCategoriesModalComponent, ReflectiveInjector.resolve([
			{ provide: RoomCategoriesModalInput, useValue: roomCategInput }
		]));
	}

	public openUsedCategoriesModal(): Promise<ModalDialogRef<RoomCategoryDO[]>> {
		var roomCategInput = new RoomCategoriesModalInput();
		roomCategInput.allowCategoryEdit = false;
		roomCategInput.roomCategoriesType = RoomCategoriesType.UsedInRooms;
		roomCategInput.allowMultiSelection = true;

		return this._appContext.modalService.open<any>(RoomCategoriesModalModule, RoomCategoriesModalComponent, ReflectiveInjector.resolve([
			{ provide: RoomCategoriesModalInput, useValue: roomCategInput }
		]));
	}
}