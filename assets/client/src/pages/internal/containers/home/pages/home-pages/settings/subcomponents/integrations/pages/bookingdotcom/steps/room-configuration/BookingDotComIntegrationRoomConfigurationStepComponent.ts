import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppContext } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BaseComponent } from '../../../../../../../../../../../../../common/base/BaseComponent';
import { LazyLoadingTableComponent } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { RoomVM } from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import { LazyLoadTableMeta, TableRowCommand, TablePropertyType } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { BookingDotComRoomConfigurationLazyLoadService } from './services/BookingDotComRoomConfigurationLazyLoadService';
import { BookingDotComRoomConfigurationVM } from './utils/BookingDotComRoomConfigurationVM';

@Component({
	selector: 'booking-dot-com-integration-room-configuration-step',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/steps/room-configuration/template/booking-dot-com-integration-room-configuration-step.html',
	providers: [BookingDotComRoomConfigurationLazyLoadService]
})
export class BookingDotComIntegrationRoomConfigurationStepComponent extends BaseComponent implements OnInit {
	
	public isSaving: boolean = false;

	@ViewChild(LazyLoadingTableComponent)
    private roomConfigurationTableComponent: LazyLoadingTableComponent<BookingDotComRoomConfigurationVM>;
	
	constructor(
		private appContext: AppContext,
		private roomConfigurationLazyLoadService: BookingDotComRoomConfigurationLazyLoadService) {
		super();
    }
    
	ngOnInit() {
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
					displayName: "Inventory Code",
					valueMeta: {
						objectPropertyId: "inventoryCode",
						propertyType: TablePropertyType.TextInputType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p left"
					}
				}
			]
		}
	}
}