import {Component, OnInit} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {BaseFormComponent} from '../../../../../../../common/base/BaseFormComponent';

@Component({
	selector: 'basic-info-payments-policies-edit',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/payments-policies/main/template/basic-info-payments-policies-edit.html',
	directives: [],
	providers: [],
	pipes: [TranslationPipe]
})

export class BasicInfoPaymentsAndPoliciesEditComponent extends BaseFormComponent implements OnInit {

    public ngOnInit() {
    
    }
    
    protected getDefaultControlGroup(): ControlGroup {
		return null;
	}
}