import { Component, OnInit } from '@angular/core';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';

import {YieldManagerDashboardKeyMetricsService} from '../../../../../../../../services/yield-manager/dashboard/key-metrics/YieldManagerDashboardKeyMetricsService';
import {KeyMetricsResultVM} from '../../../../../../../../services/yield-manager/dashboard/key-metrics/view-models/KeyMetricsResultVM';
import {YieldManagerPeriodParam} from '../../../../../../../../services/yield-manager/dashboard/common/YieldManagerPeriodParam';

import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';

@Component({
	selector: 'yield-key-metrics',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-key-metrics/template/yield-key-metrics.html',
	providers: [YieldManagerDashboardKeyMetricsService],
	directives : [CustomScroll]
})
export class YieldKeyMetricsComponent implements OnInit {
	public matrix: string[][];
	public metricsResults: KeyMetricsResultVM;

	constructor(
		private _keyMetricsService : YieldManagerDashboardKeyMetricsService,
		private _appContext : AppContext
	) { 
	}

	public getDateLabel(date: ThDateDO){
		return date.getShortDisplayString(this._appContext.thTranslation);
	}

	ngOnInit() {
		var referenceDate = ThDateDO.buildThDateDO(2016, 7, 1);
		this._keyMetricsService.getKeyMetrics({ referenceDate: referenceDate, noDays: 21}).subscribe((results:KeyMetricsResultVM) => {
			this.metricsResults = results;
		}, (e) => {
			console.log(e);
		});
	}

	public getPercentageStyles(percentage) {
       const PERCENTAGE_MID = 0.5;
	   const PERCENTAGE_MIN = 0;
	   const PERCENTAGE_MAX = 1;
       var red, green;

	   var rgbStr = "";
       if(percentage < PERCENTAGE_MIN || percentage > PERCENTAGE_MAX) {
           rgbStr = "rgb(0, 255, 0)";
       }
       else if(percentage >= PERCENTAGE_MIN && percentage <= PERCENTAGE_MID) {
           green = Math.round((percentage / PERCENTAGE_MID) * 255);
           rgbStr = "rgb(255," + green + ", 0)"
       }
       else {
           red =  Math.round((PERCENTAGE_MAX - ((percentage - PERCENTAGE_MID) / PERCENTAGE_MID)) * 255 );
           rgbStr = "rgb(" + red + ", 255, 0)";
       }

	   return {
		   "border-left-color": rgbStr
	   }
   }

}