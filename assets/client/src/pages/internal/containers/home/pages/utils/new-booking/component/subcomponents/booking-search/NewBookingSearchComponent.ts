import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThDateIntervalPickerComponent} from '../../../../../../../../../../common/utils/components/ThDateIntervalPickerComponent';
import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThDateUtils} from '../../../../../../../../services/common/data-objects/th-dates/ThDateUtils';

@Component({
	selector: 'new-booking-search',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/template/new-booking-search.html',
	directives: [CustomScroll, ThDateIntervalPickerComponent],
	pipes: [TranslationPipe]
})
export class NewBookingSearchComponent extends BaseComponent implements OnInit {
	minDate: ThDateDO;

	constructor() {
		super();
		var thDateUtils = new ThDateUtils();
		this.minDate = thDateUtils.getTodayThDayeDO();
	}

	ngOnInit() { }

	public didSelectBookingInterval(openInterval: ThDateIntervalDO) {
	}
}