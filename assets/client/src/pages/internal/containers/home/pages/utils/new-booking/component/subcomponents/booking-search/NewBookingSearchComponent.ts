import {Component, AfterViewInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {SearchInputTextComponent, SearchInputTextParams} from '../../../../../../../../../../common/utils/components/SearchInputTextComponent';
import {ThDateIntervalPickerComponent} from '../../../../../../../../../../common/utils/components/ThDateIntervalPickerComponent';
import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThDateUtils} from '../../../../../../../../services/common/data-objects/th-dates/ThDateUtils';
import {CustomerSearchService} from '../../../../../../../../services/customers/CustomerSearchService';
import {CustomerVM} from '../../../../../../../../services/customers/view-models/CustomerVM';

@Component({
	selector: 'new-booking-search',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/template/new-booking-search.html',
	directives: [CustomScroll, ThDateIntervalPickerComponent, SearchInputTextComponent],
	providers: [CustomerSearchService],
	pipes: [TranslationPipe]
})
export class NewBookingSearchComponent extends BaseComponent implements AfterViewInit {
	minDate: ThDateDO;
	@ViewChild(SearchInputTextComponent)
	private _customerSearchTextInputComponent: SearchInputTextComponent<CustomerVM>;

	constructor(private _customerSearchService: CustomerSearchService) {
		super();
		var thDateUtils = new ThDateUtils();
		this.minDate = thDateUtils.getTodayThDayeDO();
	}

	ngAfterViewInit() {
		this._customerSearchTextInputComponent.bootstrap(this._customerSearchService, {
			objectPropertyId: "customer.id",
			displayStringPropertyId: "customerNameString"
		});
	}

	public didSelectBookingInterval(openInterval: ThDateIntervalDO) {
	}
}