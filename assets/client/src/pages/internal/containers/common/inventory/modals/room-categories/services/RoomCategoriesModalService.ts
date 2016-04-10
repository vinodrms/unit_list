import {Injectable, Injector, provide} from 'angular2/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogInstance} from '../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {RoomCategoriesModalComponent} from '../RoomCategoriesModalComponent';
import {RoomCategoriesModalInput} from './utils/RoomCategoriesModalInput';
import {RoomCategoryDO} from '../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {RoomCategoriesType} from '../../../../../../services/room-categories/RoomCategoriesService';

@Injectable()
export class RoomCategoriesModalService {

	constructor(private _appContext: AppContext) { }

	public openAllCategoriesModal(allowCategoryEdit: boolean, initialRoomCategoryId?: string): Promise<ModalDialogInstance<RoomCategoryDO>> {
		var roomCategInput = new RoomCategoriesModalInput();
		roomCategInput.allowCategoryEdit = allowCategoryEdit;
		roomCategInput.initialRoomCategoryId = initialRoomCategoryId;
		roomCategInput.roomCategoriesType = RoomCategoriesType.AllCategories;

		return this._appContext.modalService.open<any>(<any>RoomCategoriesModalComponent, Injector.resolve([
			provide(RoomCategoriesModalInput, { useValue: roomCategInput })
		]));
	}
	
	public openUsedCategoriesModal(): Promise<ModalDialogInstance<RoomCategoryDO>> {
		var roomCategInput = new RoomCategoriesModalInput();
		roomCategInput.allowCategoryEdit = false;
		roomCategInput.roomCategoriesType = RoomCategoriesType.UsedInRooms;

		return this._appContext.modalService.open<any>(<any>RoomCategoriesModalComponent, Injector.resolve([
			provide(RoomCategoriesModalInput, { useValue: roomCategInput })
		]));
	}
}