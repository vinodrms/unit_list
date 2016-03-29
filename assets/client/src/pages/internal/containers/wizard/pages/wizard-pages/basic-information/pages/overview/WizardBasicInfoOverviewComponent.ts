import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {WizardBasicInfoOverviewService} from './services/WizardBasicInfoOverviewService';
import {WizardBasicInformationStateService} from '../../main/services/WizardBasicInformationStateService';
import {BasicInfoOverviewEditComponent} from '../../../../../../common/basic-info/overview/main/BasicInfoOverviewEditComponent';
import {BasicInfoOverviewEditService} from '../../../../../../common/basic-info/overview/main/services/BasicInfoOverviewEditService';

@Component({
	selector: 'wizard-basic-info-overview',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/pages/overview/template/wizard-basic-info-overview.html',
	directives: [BasicInfoOverviewEditComponent],
	providers: [BasicInfoOverviewEditService],
	pipes: [TranslationPipe]
})
export class WizardBasicInfoOverviewComponent extends BaseComponent implements OnInit {
	constructor(private _overviewEditService: BasicInfoOverviewEditService,
		private _overviewService: WizardBasicInfoOverviewService,
		private _basicInfoStateService: WizardBasicInformationStateService) {
		super();

	}
	ngOnInit() {
		this._basicInfoStateService.basicInfoController.bootstrapBasicInfoStepIndex(this._overviewService.stepIndex);
		this._overviewService.bootstrap(this._overviewEditService);
	}
}