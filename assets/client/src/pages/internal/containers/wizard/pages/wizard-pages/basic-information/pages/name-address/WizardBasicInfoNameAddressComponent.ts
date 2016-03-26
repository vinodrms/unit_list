import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../common/utils/AppContext';
import {WizardBasicInfoNameAddressService} from './services/WizardBasicInfoNameAddressService';
import {WizardBasicInformationStateService} from '../../main/services/WizardBasicInformationStateService';
import {HotelAggregatorService} from '../../../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfoDO} from '../../../../../../../services/hotel/data-objects/HotelAggregatedInfoDO';

@Component({
	selector: 'wizard-basic-info-name-address',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/pages/name-address/template/wizard-basic-info-name-address.html',
	pipes: [TranslationPipe]
})
export class WizardBasicInfoNameAddressComponent extends BaseComponent implements OnInit {

	constructor(private _nameAddressService: WizardBasicInfoNameAddressService, private _basicInfoStateService: WizardBasicInformationStateService,
		private _hotelAggregator: HotelAggregatorService) {
		super();
		_basicInfoStateService.basicInfoController.bootstrapBasicInfoStepIndex(_nameAddressService.stepIndex);
	}

	ngOnInit() {
		//TODO: remove
		this._hotelAggregator.getHotelHotelAggregatedInfoDO().subscribe((hotelDetails: HotelAggregatedInfoDO) => {
		}, (error: ThError) => {
		});
	}
}