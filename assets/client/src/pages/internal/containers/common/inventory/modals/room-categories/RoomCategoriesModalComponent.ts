import {Observable} from 'rxjs/Observable';
import {Component, OnInit, AfterViewChecked, ViewChild, ElementRef} from '@angular/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {RoomCategoriesModalService} from './services/RoomCategoriesModalService';
import {RoomCategoriesModalInput} from './services/utils/RoomCategoriesModalInput';
import {RoomCategoriesService} from '../../../../../services/room-categories/RoomCategoriesService';
import {RoomCategoriesStatsService} from '../../../../../services/room-categories/RoomCategoriesStatsService';
import {RoomCategoryDO} from '../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {RoomCategoryVM} from './services/view-models/RoomCategoryVM';
import {RoomCategoryStatsDO} from '../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';

@Component({
	selector: 'room-categories-modal',
	templateUrl: "/client/src/pages/internal/containers/common/inventory/modals/room-categories/template/room-categories-modal.html",
	providers: [RoomCategoriesService, RoomCategoriesStatsService]
})
export class RoomCategoriesModalComponent extends BaseComponent implements ICustomModalComponent, OnInit, AfterViewChecked {
	isLoading: boolean = true;

	private _scrollToBottom: boolean = false;
	@ViewChild('scrollableContent') private tableScrollContainer: ElementRef;

	allowCategoryEdit: boolean;
	roomCategoryVMList: RoomCategoryVM[];
	selectedCategoryVMList: RoomCategoryVM[] = [];

	constructor(private _appContext: AppContext,
		private _modalDialogRef: ModalDialogRef<RoomCategoryDO[]>,
		private _roomCategModalInput: RoomCategoriesModalInput,
		private _roomCategService: RoomCategoriesService,
		private _roomCategStatsService: RoomCategoriesStatsService) {
		super();
		this.allowCategoryEdit = this._roomCategModalInput.allowCategoryEdit;
		this._roomCategService.categoriesType = this._roomCategModalInput.roomCategoriesType;
	}

	public ngOnInit() {
		this._roomCategService.getRoomCategoryList().switchMap((roomCategoryList: RoomCategoryDO[]) => {
			var roomCategoryIdList = _.map(roomCategoryList, (roomCategoryDO: RoomCategoryDO) => {
				return roomCategoryDO.id;
			})
			return this._roomCategStatsService.getRoomCategoryStatsForRoomCategoryIdList(roomCategoryIdList);
		}).subscribe((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
			this.roomCategoryVMList = [];
			_.forEach(roomCategoryStatsList, (roomCategStatsDO: RoomCategoryStatsDO) => {
				var roomCategVM = new RoomCategoryVM();
				roomCategVM.roomCategory = roomCategStatsDO.roomCategory;
				roomCategVM.capacity = roomCategStatsDO.capacity;
				this.roomCategoryVMList.push(roomCategVM);
				if (this._roomCategModalInput.initialRoomCategoryId && roomCategVM.roomCategory.id === this._roomCategModalInput.initialRoomCategoryId) {
					this.selectedCategoryVMList = [roomCategVM];
				}
			});
			this.isLoading = false;
		});
	}

	public ngAfterViewChecked() {
		if (this._scrollToBottom) {
			this.scrollToBottom();
			this._scrollToBottom = false;
		}
	}
	private scrollToBottom(): void {
        try {
            this.tableScrollContainer.nativeElement.scrollTop = this.tableScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

	public closeDialog() {
		this._modalDialogRef.closeForced();
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Medium;
	}

	public editRoomCategory(roomCategVM: RoomCategoryVM) {
		roomCategVM.isEditing = true;
	}
	public saveRoomCategory(roomCategVM: RoomCategoryVM) {
		if (!roomCategVM.roomCategory.displayName) {
			return;
		}
		if (this.otherRoomCategoriesExistWithSameName(roomCategVM)) {
			var translatedMsg = this._appContext.thTranslation.translate("The room category name you entered already exists");
			this._appContext.toaster.error(translatedMsg);
			return;
		}
		roomCategVM.isSaving = true;
		this._roomCategService.saveRoomCategory(roomCategVM.roomCategory).subscribe((savedCateg: RoomCategoryDO) => {
			roomCategVM.roomCategory = savedCateg;
			roomCategVM.isEditing = false;
			roomCategVM.isSaving = false;
		}, (error: ThError) => {
			roomCategVM.isSaving = false;
			this._appContext.toaster.error(error.message);
		});
	}
	private otherRoomCategoriesExistWithSameName(roomCategVMToCheck: RoomCategoryVM) {
		var categList = _.filter(this.roomCategoryVMList, (roomCategVM: RoomCategoryVM) => {
			return roomCategVM.roomCategory.displayName === roomCategVMToCheck.roomCategory.displayName &&
				roomCategVM.roomCategory.id !== roomCategVMToCheck.roomCategory.id &&
				roomCategVM.roomCategory.id != null;
		});
		return categList.length > 0;
	}

	public addRoomCategory() {
		var roomCategVM = new RoomCategoryVM();
		var roomCategDO = new RoomCategoryDO();
		roomCategVM.roomCategory = roomCategDO;
		roomCategVM.isEditing = true;
		this.roomCategoryVMList.push(roomCategVM);
		this._scrollToBottom = true;
	}
	public didSelectCategory(): boolean {
		return this.selectedCategoryVMList.length > 0;
	}
	public selectRoomCategory(roomCategVM: RoomCategoryVM) {
		if (this._roomCategModalInput.allowMultiSelection) {
			if (!this.isCategorySelected(roomCategVM)) {
				this.selectedCategoryVMList.push(roomCategVM);
			}
			else {
				this.selectedCategoryVMList = _.filter(this.selectedCategoryVMList, (innerRoomCategVM: RoomCategoryVM) => {
					return innerRoomCategVM.roomCategory.id !== roomCategVM.roomCategory.id;
				});
			}
		}
		else {
			this.selectedCategoryVMList = [roomCategVM];
		}
	}
	public isCategorySelected(roomCategVM: RoomCategoryVM): boolean {
		return this.didSelectCategory() &&
			(_.find(this.selectedCategoryVMList, (innerRoomCategVM: RoomCategoryVM) => {
				return innerRoomCategVM.roomCategory.id === roomCategVM.roomCategory.id
			})) != null;
	}
	public triggerSelectedCategory() {
		if (!this.didSelectCategory()) {
			return;
		}
		this._modalDialogRef.addResult(_.map(this.selectedCategoryVMList, (roomCategVM: RoomCategoryVM) => {
			return roomCategVM.roomCategory;
		}));
		this.closeDialog();
	}
}