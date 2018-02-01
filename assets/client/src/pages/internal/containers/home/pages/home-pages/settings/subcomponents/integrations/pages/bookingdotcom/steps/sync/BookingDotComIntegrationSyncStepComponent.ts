import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BaseComponent } from '../../../../../../../../../../../../../common/base/BaseComponent';
import { LazyLoadingTableComponent } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { LazyLoadTableMeta, TableRowCommand, TablePropertyType } from '../../../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { YieldFiltersService } from '../../../../../../../../../../../services/hotel-configurations/YieldFiltersService';
import { LazyLoadData } from '../../../../../../../../../../../services/common/ILazyLoadRequestService';
import { GetBookingDotComConfigurationService } from '../../services/GetBookingDotComConfigurationService';
import { BookingDotComConfigurationDO } from '../../services/utils/BookingDotComConfigurationDO';

import  _ = require('underscore');

@Component({
	selector: 'booking-dot-com-integration-sync-step',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/integrations/pages/bookingdotcom/steps/sync/template/booking-dot-com-integration-sync-step.html',
	providers: [GetBookingDotComConfigurationService]
})
export class BookingDotComIntegrationSyncStepComponent extends BaseComponent implements OnInit {

	public isSyncing: boolean = false;
	public isLoading: boolean = false;

    private configuration: BookingDotComConfigurationDO;
    private lastSyncTimestamp: number;

	constructor(
		private appContext: AppContext,
		private getBookingDotComConfigurationService: GetBookingDotComConfigurationService) {
		super();
    }

	ngOnInit() {
		this.isLoading = true;
		this.getBookingDotComConfigurationService.getConfiguration().subscribe((configuration: BookingDotComConfigurationDO) => {
            this.configuration = configuration;
            this.isLoading = false;
		});
	}

	public syncRatesAndAvailability() {
        this.isSyncing = true;
		this.appContext.thHttp.post({
			serverApi: ThServerApi.BookingDotComSyncRatesAndAvailability
		}).subscribe((config: BookingDotComConfigurationDO) => {
            this.isSyncing = false;
            this.configuration = config;
			this.appContext.toaster.success(this.appContext.thTranslation.translate("Rates and availability were pushed successfully to booking.com"));
		},
		(error: any) => {
			this.isSyncing = false;
			this.appContext.toaster.error(this.appContext.thTranslation.translate("Error pushing data to booking.com"));
		});
    }

    protected get lastSync(): string {
        if(this.appContext.thUtils.isUndefinedOrNull(this.configuration) || this.appContext.thUtils.isUndefinedOrNull(this.configuration.lastSyncTimestamp)) {
            return '-';
        }
        let date = new Date(this.configuration.lastSyncTimestamp);
        return date.toDateString() + ' ' + date.toTimeString();
    }
}
