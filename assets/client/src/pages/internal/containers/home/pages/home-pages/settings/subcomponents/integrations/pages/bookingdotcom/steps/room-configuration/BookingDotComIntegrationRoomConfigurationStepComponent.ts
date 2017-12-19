import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BaseComponent } from '../../../../../../../../../../../../../common/base/BaseComponent';
import { LazyLoadingTableComponent } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { RoomVM } from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import { LazyLoadTableMeta, TableRowCommand, TablePropertyType } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { BookingDotComRoomConfigurationLazyLoadService } from './services/BookingDotComRoomConfigurationLazyLoadService';
import { BookingDotComRoomConfigurationVM } from './utils/BookingDotComRoomConfigurationVM';
import { GetBookingDotComConfigurationService } from '../../services/GetBookingDotComConfigurationService';
import { BookingDotComConfigurationDO } from '../../services/utils/BookingDotComConfigurationDO';
import { LazyLoadData } from '../../../../../../../../../../../services/common/ILazyLoadRequestService';
import { BookingDotComRoomConfigurationsDO, BookingDotComRoomConfigurationDO } from './utils/BookingDotComRoomConfigurationDO';

import  _ = require('underscore');

@Component({
	selector: 'booking-dot-com-integration-room-configuration-step',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/steps/room-configuration/template/booking-dot-com-integration-room-configuration-step.html',
	providers: [BookingDotComRoomConfigurationLazyLoadService, GetBookingDotComConfigurationService]
})
export class BookingDotComIntegrationRoomConfigurationStepComponent extends BaseComponent implements OnInit {
	
	public isSaving: boolean = false;
	public isLoading: boolean = false;
	private roomConfigurationVMList: BookingDotComRoomConfigurationVM[];
	private roomConfigurationsDO: BookingDotComRoomConfigurationsDO;

	@ViewChild(LazyLoadingTableComponent)
    private roomConfigurationTableComponent: LazyLoadingTableComponent<BookingDotComRoomConfigurationVM>;
	
	constructor(
		private appContext: AppContext,
		private roomConfigurationLazyLoadService: BookingDotComRoomConfigurationLazyLoadService,
		private getBookingDotComConfigurationService: GetBookingDotComConfigurationService) {
			super();
    }
    
	ngOnInit() {
		this.isLoading = true;
		this.getBookingDotComConfigurationService.getConfiguration().subscribe((configuration: BookingDotComConfigurationDO) => {
			this.roomConfigurationsDO = configuration.roomConfiguration;
			if (this.appContext.thUtils.isUndefinedOrNull(this.roomConfigurationsDO)) {
				this.roomConfigurationsDO = new BookingDotComRoomConfigurationsDO();
			}
			this.roomConfigurationLazyLoadService.getDataObservable().subscribe((lazyLoadData: LazyLoadData<BookingDotComRoomConfigurationVM>) => {
				this.roomConfigurationVMList = lazyLoadData.pageContent.pageItemList;
				this.isLoading = false;
			});
		});
	}

	public saveChanges() {
		_.each(this.roomConfigurationVMList, (roomConfigurationVM: BookingDotComRoomConfigurationVM) => {
			if (this.appContext.thUtils.isUndefinedOrNull(roomConfigurationVM.roomId) || roomConfigurationVM.roomId.length == 0) {
				return;
			}
			var ppConfig: BookingDotComRoomConfigurationDO = _.find(this.roomConfigurationsDO.roomConfigurations, (roomConfigurationDO: BookingDotComRoomConfigurationDO) => {
				return roomConfigurationVM.roomVM.room.id == roomConfigurationDO.ourRoomId;
			});
			if (this.appContext.thUtils.isUndefinedOrNull(ppConfig)) {
				ppConfig = new BookingDotComRoomConfigurationDO();
				ppConfig.ourRoomId = roomConfigurationVM.roomVM.room.id;				
				this.roomConfigurationsDO.roomConfigurations.push(ppConfig);
			}
			ppConfig.roomId = roomConfigurationVM.roomId;
		});
		this.isSaving = true;
		this.appContext.thHttp.post({
			serverApi: ThServerApi.BookingDotComIntegrationConfigureRooms,
			body: JSON.stringify(this.roomConfigurationsDO)
		}).subscribe(() => {
			this.isSaving = false;
			this.appContext.toaster.success(this.appContext.thTranslation.translate("Information Saved Succesfully"));
			this.roomConfigurationLazyLoadService.refreshData();
		},
		(error: any) => {
			this.isSaving = false;
			this.appContext.toaster.error(this.appContext.thTranslation.translate("Error Saving Information"));
		});
	}

	public ngAfterViewInit() {
        this.roomConfigurationTableComponent.bootstrap(this.roomConfigurationLazyLoadService, this.getRoomConfigurationTableMeta());
	}
	
	private getRoomConfigurationTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Select, TableRowCommand.Search],
			rowIdPropertySelector: "room.id",
			searchInputPlaceholder: "Search by name",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Name",
					valueMeta: {
						objectPropertyId: "roomVM.room.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true,
						normalStyle: "up-col-25p left",
						collapsedStyle: "up-col-70p left"
					}
				},
                {
					displayName: "Category",
					valueMeta: {
						objectPropertyId: "roomVM.category.displayName",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-25p left"
					}
				},
                {
					displayName: "Floor",
					valueMeta: {
						objectPropertyId: "roomVM.room.floor",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "Capacity",
					valueMeta: {
						objectPropertyId: "roomVM.capacity",
						propertyType: TablePropertyType.CapacityType,
						fonts: {
                            child: ";",
                            adult: ":",
							baby: "B"    
                        },
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "roomVM.room.notes",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p left"
					}
				},
				{
					displayName: "Room ID",
					valueMeta: {
						objectPropertyId: "roomId",
						propertyType: TablePropertyType.TextInputType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p left"
					}
				}
			]
		}
	}
}