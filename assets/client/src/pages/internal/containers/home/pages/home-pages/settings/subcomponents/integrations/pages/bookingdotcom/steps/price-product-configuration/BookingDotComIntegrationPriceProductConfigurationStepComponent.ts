import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BaseComponent } from '../../../../../../../../../../../../../common/base/BaseComponent';
import { LazyLoadingTableComponent } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { LazyLoadTableMeta, TableRowCommand, TablePropertyType } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { BookingDotComPriceProductConfigurationVM } from './utils/BookingDotComPriceProductConfigurationVM';
import { BookingDotComPriceProductConfigurationLazyLoadService } from './services/BookingDotComPriceProductConfigurationLazyLoadService';
import { YieldFiltersService } from '../../../../../../../../../../../services/hotel-configurations/YieldFiltersService';
import { LazyLoadData } from '../../../../../../../../../../../services/common/ILazyLoadRequestService';
import { GetBookingDotComConfigurationService } from '../../services/GetBookingDotComConfigurationService';
import { BookingDotComConfigurationDO } from '../../services/utils/BookingDotComConfigurationDO';
import { BookingDotComPriceProductConfigurationsDO, BookingDotComPriceProductConfigurationDO } from './utils/BookingDotComPriceProductConfigurationDO';

import  _ = require('underscore');

@Component({
	selector: 'booking-dot-com-integration-price-product-configuration-step',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/steps/price-product-configuration/template/booking-dot-com-integration-price-product-configuration-step.html',
	providers: [BookingDotComPriceProductConfigurationLazyLoadService, YieldFiltersService, GetBookingDotComConfigurationService]
})
export class BookingDotComIntegrationPriceProductConfigurationStepComponent extends BaseComponent implements OnInit {
	
	public isSaving: boolean = false;
	public isLoading: boolean = false;
	private priceProductConfigurationVMList: BookingDotComPriceProductConfigurationVM[];
	private priceProductConfigurationsDO: BookingDotComPriceProductConfigurationsDO;

	@ViewChild(LazyLoadingTableComponent)
    private priceProductConfigurationTableComponent: LazyLoadingTableComponent<BookingDotComPriceProductConfigurationVM>;
	
	constructor(
		private appContext: AppContext,
		private priceProductConfigurationLazyLoadService: BookingDotComPriceProductConfigurationLazyLoadService,
		private getBookingDotComConfigurationService: GetBookingDotComConfigurationService) {
		super();
    }
    
	ngOnInit() {
		this.isLoading = true;
		this.getBookingDotComConfigurationService.getConfiguration().subscribe((configuration: BookingDotComConfigurationDO) => {
			this.priceProductConfigurationsDO = configuration.priceProductConfiguration;
			if (this.appContext.thUtils.isUndefinedOrNull(this.priceProductConfigurationsDO)) {
				this.priceProductConfigurationsDO = new BookingDotComPriceProductConfigurationsDO();
			}
			this.priceProductConfigurationLazyLoadService.getDataObservable().subscribe((lazyLoadData: LazyLoadData<BookingDotComPriceProductConfigurationVM>) => {
				this.priceProductConfigurationVMList = lazyLoadData.pageContent.pageItemList;
				this.isLoading = false;
			});
		});
	}

	public ngAfterViewInit() {
        this.priceProductConfigurationTableComponent.bootstrap(this.priceProductConfigurationLazyLoadService, this.getPriceProductConfigurationTableMeta());
	}

	public saveChanges() {
		_.each(this.priceProductConfigurationVMList, (priceProductConfigurationVM: BookingDotComPriceProductConfigurationVM) => {
			if (this.appContext.thUtils.isUndefinedOrNull(priceProductConfigurationVM.rateCategoryId) || priceProductConfigurationVM.rateCategoryId.length == 0) {
				return;
			}
			var ppConfig: BookingDotComPriceProductConfigurationDO = _.find(this.priceProductConfigurationsDO.priceProductConfigurations, (priceProductConfigurationDO: BookingDotComPriceProductConfigurationDO) => {
				return priceProductConfigurationVM.priceProductVM.priceProduct.id == priceProductConfigurationDO.priceProductId;
			});
			if (this.appContext.thUtils.isUndefinedOrNull(ppConfig)) {
				ppConfig = new BookingDotComPriceProductConfigurationDO();
				ppConfig.priceProductId = priceProductConfigurationVM.priceProductVM.priceProduct.id;
				this.priceProductConfigurationsDO.priceProductConfigurations.push(ppConfig);
			}
			ppConfig.enabled = priceProductConfigurationVM.enabled;
			ppConfig.rateCategoryId = priceProductConfigurationVM.rateCategoryId;
		});
		this.isSaving = true;
		this.appContext.thHttp.post({
			serverApi: ThServerApi.BookingDotComIntegrationConfigurePriceProducts,
			body: JSON.stringify(this.priceProductConfigurationsDO)
		}).subscribe(() => {
			this.isSaving = false;
			this.appContext.toaster.success(this.appContext.thTranslation.translate("Information Saved Succesfully"));
			this.priceProductConfigurationLazyLoadService.refreshData();
		},
		(error: any) => {
			this.isSaving = false;
			this.appContext.toaster.error(this.appContext.thTranslation.translate("Error Saving Information"));
		});
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
					displayName: "Rate Category ID",
					valueMeta: {
						objectPropertyId: "rateCategoryId",
						propertyType: TablePropertyType.TextInputType,
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