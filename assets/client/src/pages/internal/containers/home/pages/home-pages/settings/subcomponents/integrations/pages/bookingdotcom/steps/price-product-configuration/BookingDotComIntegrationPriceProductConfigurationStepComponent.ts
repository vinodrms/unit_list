import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppContext } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BaseComponent } from '../../../../../../../../../../../../../common/base/BaseComponent';
import { LazyLoadingTableComponent } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { LazyLoadTableMeta, TableRowCommand, TablePropertyType } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { BookingDotComPriceProductConfigurationVM } from './utils/BookingDotComPriceProductConfigurationVM';
import { BookingDotComPriceProductConfigurationLazyLoadService } from './services/BookingDotComPriceProductConfigurationLazyLoadService';
import { YieldFiltersService } from '../../../../../../../../../../../services/hotel-configurations/YieldFiltersService';

@Component({
	selector: 'booking-dot-com-integration-price-product-configuration-step',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/steps/price-product-configuration/template/booking-dot-com-integration-price-product-configuration-step.html',
	providers: [BookingDotComPriceProductConfigurationLazyLoadService, YieldFiltersService]
})
export class BookingDotComIntegrationPriceProductConfigurationStepComponent extends BaseComponent implements OnInit {
	
	public isSaving: boolean = false;

	@ViewChild(LazyLoadingTableComponent)
    private priceProductConfigurationTableComponent: LazyLoadingTableComponent<BookingDotComPriceProductConfigurationVM>;
	
	constructor(
		private appContext: AppContext,
		private priceProductConfigurationLazyLoadService: BookingDotComPriceProductConfigurationLazyLoadService) {
		super();
    }
    
	ngOnInit() {
	}

	public ngAfterViewInit() {
        this.priceProductConfigurationTableComponent.bootstrap(this.priceProductConfigurationLazyLoadService, this.getPriceProductConfigurationTableMeta());
	}
	
	private getPriceProductConfigurationTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Select, TableRowCommand.Search],
			rowIdPropertySelector: "priceProduct.id",
			searchInputPlaceholder: "Search by name",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Name",
					valueMeta: {
						objectPropertyId: "priceProductVM.priceProduct.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true,
						normalStyle: "up-col-10p left",
						collapsedStyle: "up-col-70p left"
					}
				},
				{
					displayName: "Related To",
					valueMeta: {
						objectPropertyId: "priceProductVM.parentPriceProductName",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-10p center",
					}
				},
				{
					displayName: "Room Categories",
					valueMeta: {
						objectPropertyId: "priceProductVM.roomCategoriesString",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p left"
					}
				},
				{
					displayName: "Price Brief",
					valueMeta: {
						objectPropertyId: "priceProductVM.priceBrief",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center"
					}
				},
				{
					displayName: "Type of Price",
					valueMeta: {
						objectPropertyId: "priceProductVM.priceTypeString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center"
					}
				},
				{
					displayName: "Availability",
					valueMeta: {
						objectPropertyId: "priceProductVM.availabilityString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center"
					}
				},
				{
					displayName: "Enabled",
					valueMeta: {
						objectPropertyId: "enabled",
						propertyType: TablePropertyType.CheckboxInputType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center"
					}
				}
			]
		}
	}
}