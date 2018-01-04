import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BaseComponent } from '../../../../../../../../../../../../../common/base/BaseComponent';
import { LazyLoadingTableComponent } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { RoomVM } from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import { LazyLoadTableMeta, TableRowCommand, TablePropertyType } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { BookingDotComRoomCategoryConfigurationLazyLoadService } from './services/BookingDotComRoomCategoryConfigurationLazyLoadService';
import { BookingDotComRoomCategoryConfigurationVM } from './utils/BookingDotComRoomCategoryConfigurationVM';
import { GetBookingDotComConfigurationService } from '../../services/GetBookingDotComConfigurationService';
import { BookingDotComConfigurationDO } from '../../services/utils/BookingDotComConfigurationDO';
import { LazyLoadData } from '../../../../../../../../../../../services/common/ILazyLoadRequestService';
import { BookingDotComRoomCategoryConfigurationsDO, BookingDotComRoomConfigurationDO } from './utils/BookingDotComRoomConfigurationDO';

import  _ = require('underscore');

@Component({
	selector: 'booking-dot-com-integration-room-category-configuration-step',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/steps/room-configuration/template/booking-dot-com-integration-room-category-configuration-step.html',
	providers: [BookingDotComRoomCategoryConfigurationLazyLoadService, GetBookingDotComConfigurationService]
})
export class BookingDotComIntegrationRoomCategoryConfigurationStepComponent extends BaseComponent implements OnInit {
	
	public isSaving: boolean = false;
	public isLoading: boolean = false;
	private roomCategoryConfigurationVMList: BookingDotComRoomCategoryConfigurationVM[];
	private roomCategoryConfigurationsDO: BookingDotComRoomCategoryConfigurationsDO;

	@ViewChild(LazyLoadingTableComponent)
    private roomCategoryConfigurationTableComponent: LazyLoadingTableComponent<BookingDotComRoomCategoryConfigurationVM>;
	
	constructor(
		private appContext: AppContext,
		private roomCategoryConfigurationLazyLoadService: BookingDotComRoomCategoryConfigurationLazyLoadService,
		private getBookingDotComConfigurationService: GetBookingDotComConfigurationService) {
			super();
    }
    
	ngOnInit() {
		this.isLoading = true;
		this.getBookingDotComConfigurationService.getConfiguration().subscribe((configuration: BookingDotComConfigurationDO) => {
			this.roomCategoryConfigurationsDO = configuration.roomCategoryConfiguration;
			if (this.appContext.thUtils.isUndefinedOrNull(this.roomCategoryConfigurationsDO)) {
				this.roomCategoryConfigurationsDO = new BookingDotComRoomCategoryConfigurationsDO();
			}
			this.roomCategoryConfigurationLazyLoadService.getDataObservable().subscribe((lazyLoadData: LazyLoadData<BookingDotComRoomCategoryConfigurationVM>) => {
				this.roomCategoryConfigurationVMList = lazyLoadData.pageContent.pageItemList;
				this.isLoading = false;
			});
		});
	}

	public saveChanges() {
		_.each(this.roomCategoryConfigurationVMList, (roomCategoryConfigurationVM: BookingDotComRoomCategoryConfigurationVM) => {
			if (this.appContext.thUtils.isUndefinedOrNull(roomCategoryConfigurationVM.roomId) || roomCategoryConfigurationVM.roomId.length == 0) {
				return;
			}
			var ppConfig: BookingDotComRoomConfigurationDO = _.find(this.roomCategoryConfigurationsDO.roomCategoryConfigurations, (roomCategoryConfigurationDO: BookingDotComRoomConfigurationDO) => {
				return roomCategoryConfigurationVM.roomCategoryStats.roomCategory.id == roomCategoryConfigurationDO.ourRoomCategoryId;
			});
			if (this.appContext.thUtils.isUndefinedOrNull(ppConfig)) {
				ppConfig = new BookingDotComRoomConfigurationDO();
				ppConfig.ourRoomCategoryId = roomCategoryConfigurationVM.roomCategoryStats.roomCategory.id;				
				this.roomCategoryConfigurationsDO.roomCategoryConfigurations.push(ppConfig);
			}
			ppConfig.roomId = roomCategoryConfigurationVM.roomId;
		});
		this.isSaving = true;
		this.appContext.thHttp.post({
			serverApi: ThServerApi.BookingDotComIntegrationConfigureRooms,
			body: JSON.stringify(this.roomCategoryConfigurationsDO)
		}).subscribe(() => {
			this.isSaving = false;
			this.appContext.toaster.success(this.appContext.thTranslation.translate("Information Saved Succesfully"));
			this.roomCategoryConfigurationLazyLoadService.refreshData();
		},
		(error: any) => {
			this.isSaving = false;
			this.appContext.toaster.error(this.appContext.thTranslation.translate("Error Saving Information"));
		});
	}

	public ngAfterViewInit() {
        this.roomCategoryConfigurationTableComponent.bootstrap(this.roomCategoryConfigurationLazyLoadService, this.getRoomCategoryConfigurationTableMeta());
	}
	
	private getRoomCategoryConfigurationTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Select],
			rowIdPropertySelector: "roomCategoryStats.roomCategory.id",
			autoSelectRows: false,
			columnMetaList: [
                {
					displayName: "Category",
					valueMeta: {
						objectPropertyId: "roomCategoryStats.roomCategory.displayName",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true,
						normalStyle: "up-col-50p left"
					}
				},
				{
					displayName: "Room ID",
					valueMeta: {
						objectPropertyId: "roomId",
						propertyType: TablePropertyType.TextInputType,
						showInCollapsedView: true,
						normalStyle: "up-col-50p left"
					}
				}
			]
		}
	}
}