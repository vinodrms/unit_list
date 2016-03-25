import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {WizardBasicInfoNameAddressService} from './services/WizardBasicInfoNameAddressService';
import {WizardBasicInformationStateService} from '../../main/services/WizardBasicInformationStateService';

@Component({
	selector: 'wizard-basic-info-name-address',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/pages/name-address/template/wizard-basic-info-name-address.html',
	pipes: [TranslationPipe]
})
export class WizardBasicInfoNameAddressComponent extends BaseComponent implements OnInit {

	constructor(private _nameAddressService: WizardBasicInfoNameAddressService, private _basicInfoStateService: WizardBasicInformationStateService) {
		super();
		_basicInfoStateService.basicInfoController.bootstrapBasicInfoStepIndex(_nameAddressService.stepIndex);
	}

	ngOnInit() { }
}