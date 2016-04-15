import {Component, OnInit, Input} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {CorporateDetailsDO} from '../../../../../../../../services/customers/data-objects/customer-details/CorporateDetailsDO';

@Component({
	selector: 'corporate-customer-details',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/pages/customer-edit/customer-details/corporate/template/corporate-customer-details.html',
	pipes: [TranslationPipe]
})

export class CorporateCustomerDetailsComponent extends BaseComponent implements OnInit {
	@Input() didSubmit: boolean;

	private _corporateDetails: CorporateDetailsDO;
	public get corporateDetails(): CorporateDetailsDO {
		return this._corporateDetails;
	}
	@Input()
	public set corporateDetails(corporateDetails: CorporateDetailsDO) {
		if (!corporateDetails) {
			return;
		}
		this._corporateDetails = corporateDetails;
	}

	constructor() {
		super();
	}

	ngOnInit() { }
}