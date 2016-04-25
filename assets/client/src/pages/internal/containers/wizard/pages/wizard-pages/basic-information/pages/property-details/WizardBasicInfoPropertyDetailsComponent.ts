import { Component, OnInit } from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {WizardBasicInformationStateService} from '../../main/services/WizardBasicInformationStateService';
import {BasicInfoPropertyDetailsEditComponent} from '../../../../../../common/basic-info/property-details/main/BasicInfoPropertyDetailsEditComponent';
import {BasicInfoPropertyDetailsEditService} from '../../../../../../common/basic-info/property-details/main/services/BasicInfoPropertyDetailsEditService';
import {WizardBasicInfoPropertyDetailsService} from './services/WizardBasicInfoPropertyDetailsService';

//TODO: change this code to use Decorator
import {WizardStepsComponent} from '../../../../utils/wizard-steps/WizardStepsComponent';
@Component({
	selector: 'wizard-basic-info-property-details',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/pages/property-details/template/wizard-basic-info-property-details.html',
	directives: [WizardStepsComponent, BasicInfoPropertyDetailsEditComponent],
	providers: [BasicInfoPropertyDetailsEditService],
	pipes: [TranslationPipe]
})
export class WizardBasicInfoPropertyDetailsComponent extends BaseComponent implements OnInit {
    constructor(private _overviewEditService: BasicInfoPropertyDetailsEditService,
		private _overviewService: WizardBasicInfoPropertyDetailsService, 
        private _basicInfoStateService: WizardBasicInformationStateService) { 
            super();
        }

    ngOnInit() { 
        this._basicInfoStateService.basicInfoController.bootstrapBasicInfoStepIndex(this._overviewService.stepIndex);
		this._overviewService.bootstrap(this._overviewEditService);
    }

}