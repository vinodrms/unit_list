import { Component, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../common/base/BaseComponent";
import { ReportOutputFormatType } from "../../utils/ReportOutputFormatType";
import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { SettingsReportsPagesService } from "../../main/services/SettingsReportsPagesService";
import { ReportGroupType } from "../../utils/ReportGroupType";
import { ThDateDO } from "../../../../../../../../../services/common/data-objects/th-dates/ThDateDO";
import { SettingsReportsService } from "../../main/services/SettingsReportsService";
import { HotelService } from "../../../../../../../../../services/hotel/HotelService";
import { HotelDetailsDO } from "../../../../../../../../../services/hotel/data-objects/HotelDetailsDO";

@Component({
    selector: 'bookings-by-interval',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/bookings-by-interval/template/bookings-by-interval-report.html',
    providers: [SettingsReportsService]
})
export class BookingsByIntervalReportComponent extends BaseComponent {
    private startDate: ThDateDO;
    private endDate: ThDateDO;
    private format: ReportOutputFormatType;
    private isLoading: boolean = false;

    constructor(private _appContext: AppContext,
        private _hotelService: HotelService,
        private _pagesService: SettingsReportsPagesService) {
        super();

        this._pagesService.bootstrapSelectedTab(ReportGroupType.BookingsByInterval);
    }

    ngOnInit() {
		this._hotelService.getHotelDetailsDO().subscribe((details: HotelDetailsDO) => {
			this.startDate = details.currentThTimestamp.thDateDO.buildPrototype();
			this.endDate = this.startDate.buildPrototype();
			this.endDate.addDays(1);
			this.isLoading = false;
		}, (error: any) => {
			this._appContext.toaster.error(error.message);
		});
	}

    public didSelectStartDate(startDate) {
        this.startDate = startDate;
    }

    public didSelectEndDate(endDate) {
        this.endDate = endDate;
    }

    public didSelectFormat(format: ReportOutputFormatType) {
        this.format = format;
    }

    public reportCSVUrl(): string {
        let params = {
            reportType: ReportGroupType.BookingsByInterval,
            format: this.format,
            properties: {
                startDate: this.startDate,
                endDate: this.endDate
            }
        }

        var encodedParams = encodeURI(JSON.stringify(params));
        return 'api/reports/report?params=' + encodedParams;
    }
}