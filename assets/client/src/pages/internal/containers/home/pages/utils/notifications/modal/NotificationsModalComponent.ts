import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';
import {LoadingComponent} from '../../../../../../../../common/utils/components/LoadingComponent';
import {ThError, AppContext} from '../../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {LazyLoadingTableComponent} from '../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NotificationService} from '../../../../../../services/notifications/NotificationService';
import {ThNotificationDO} from '../../../../../../services/notifications/data-objects/ThNotificationDO';
import {NotificationsTableMetaBuilderService} from './services/NotificationsTableMetaBuilderService';
import {NotificationsModalInput} from './services/utils/NotificationsModalInput';

enum SelectedTab {
	ALL,
	UNREAD
}
var SelectedTabSearchCriteria: { [index: number]: Object; } = {};
SelectedTabSearchCriteria[SelectedTab.ALL] = {};
SelectedTabSearchCriteria[SelectedTab.UNREAD] = { read: false };

@Component({
	selector: 'notifications-modal',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/notifications/modal/template/notifications-modal.html',
	providers: [NotificationService, NotificationsTableMetaBuilderService],
	directives: [CustomScroll, LazyLoadingTableComponent],
	pipes: [TranslationPipe]
})
export class NotificationsModalComponent extends BaseComponent implements ICustomModalComponent, AfterViewInit {
	@ViewChild(LazyLoadingTableComponent)
	private _notificationsTableComponent: LazyLoadingTableComponent<ThNotificationDO>;
	private _selectedTab: SelectedTab;

	private _selectedNotification: ThNotificationDO;

	constructor(
		private _modalDialogRef: ModalDialogRef<boolean>,
		private _modalInput: NotificationsModalInput,
		private _notificationService: NotificationService,
		private _tableBuilder: NotificationsTableMetaBuilderService) {
		super();
		this._selectedTab = SelectedTab.ALL;
		this.selectedNotification = this._modalInput.preselectedNotification;	
	}

	ngOnInit() { }

	public get selectedNotification(): ThNotificationDO {
		return this._selectedNotification;
	}
	public set selectedNotification(selectedNotification: ThNotificationDO) {
		if(!selectedNotification) {
			return;
		}
		this._selectedNotification = selectedNotification;
		this._notificationService
			.markNotificationsAsRead({notificationId: selectedNotification.notification.id})
			.subscribe((numUpdated : number) => {
				this._modalDialogRef.addResult(true);
				this._notificationService.refreshData();
			});
	}

	public ngAfterViewInit() {
		this._notificationsTableComponent.bootstrap(this._notificationService, this._tableBuilder.buildLazyLoadTableMeta());
		if (this._modalInput.preselectedNotification) {
			this._notificationsTableComponent.selectItem(this.selectedNotification);
		}
	}

	public closeDialog() {
		this._modalDialogRef.closeForced();
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Large;
	}

	public selectNotification(selectedNotification: ThNotificationDO) {
		this.selectedNotification = selectedNotification;
	}

	public isAllNotificationsTabSelected(): boolean {
		return this._selectedTab == SelectedTab.ALL;
	}

	public isUnreadNotificationsTabSelected(): boolean {
		return this._selectedTab == SelectedTab.UNREAD;
	}

	public viewAllNotifications() {
		this.updateSelectedTab(SelectedTab.ALL);
	}

	public viewUnreadNotifications() {
		this.updateSelectedTab(SelectedTab.UNREAD);
	}

	private updateSelectedTab(selectedTab: SelectedTab) {
		if (this._selectedTab == selectedTab) {
			// Do nothing if the selection is not new.
			return;
		}
		this._selectedTab = selectedTab;
		this._notificationService.setSearchCriteria(SelectedTabSearchCriteria[selectedTab]);
		this._notificationService.refreshData();
	}
}