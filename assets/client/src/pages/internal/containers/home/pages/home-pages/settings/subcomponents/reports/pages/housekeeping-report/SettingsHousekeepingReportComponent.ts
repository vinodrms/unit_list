import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { SettingsReportsPagesService } from '../../main/services/SettingsReportsPagesService';
import { ThDateDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { SettingsReportsService } from '../../main/services/SettingsReportsService';
import { ReportGroupType } from '../../utils/ReportGroupType';
import { ReportOutputFormatType } from '../../utils/ReportOutputFormatType';

enum HousekeepingReportGroupByType {
    Nothing,
    Floor
}

class HousekeepingReportGroupBy {
    type: HousekeepingReportGroupByType;
    displayName: string;

    constructor(type: HousekeepingReportGroupByType, displayName: string) {
        this.type = type;
        this.displayName = displayName;
    }

    public static getPossibleValues(): HousekeepingReportGroupBy[] {
        return [
            new HousekeepingReportGroupBy(HousekeepingReportGroupByType.Nothing, "Nothing"),
            new HousekeepingReportGroupBy(HousekeepingReportGroupByType.Floor, "Floor")
        ]
    }
}

@Component({
	selector: 'settings-housekeeping-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/housekeeping-report/template/settings-housekeeping-report.html',
	providers: [SettingsReportsService]
})
export class SettingsHousekeepingReportComponent extends BaseComponent {
	private startDate: ThDateDO;
	private endDate: ThDateDO;
	private format: ReportOutputFormatType;
	private selectedGroupByType: HousekeepingReportGroupByType;


	constructor(
		private _appContext: AppContext,
		private _backendService: SettingsReportsService,
		private _pagesService: SettingsReportsPagesService) {
		super();
		this._pagesService.bootstrapSelectedTab(ReportGroupType.Housekeeping);
		this.selectedGroupByType = this.getPossibleHousekeepingReportGroupByValues()[0].type;
	}
	ngOnInit() {
	}

	public didSelectFormat(format: ReportOutputFormatType) {
		this.format = format;
	}

	public reportCSVUrl(): string {
		let params = {
			reportType: ReportGroupType.Housekeeping,
			format: this.format,
			properties: {
				groupBy: this.selectedGroupByType
			}
		}

		var encodedParams = encodeURI(JSON.stringify(params));
		return 'api/reports/report?params=' + encodedParams;
	}

	public getPossibleHousekeepingReportGroupByValues(): HousekeepingReportGroupBy[] {
		return HousekeepingReportGroupBy.getPossibleValues();
	}
}