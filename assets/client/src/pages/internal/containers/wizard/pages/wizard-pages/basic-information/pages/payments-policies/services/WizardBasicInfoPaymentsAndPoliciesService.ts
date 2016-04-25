import {Injectable} from 'angular2/core';
import {IBasicInfoStep} from '../../../main/services/IBasicInfoStep';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {BasicInfoPaymentsAndPoliciesEditService} from '../../../../../../../common/basic-info/payments-policies/main/services/BasicInfoPaymentsAndPoliciesEditService';

@Injectable()
export class WizardBasicInfoPaymentsAndPoliciesService implements IBasicInfoStep {
	private _editService: BasicInfoPaymentsAndPoliciesEditService;

	stepIndex: number;
	constructor() {
	}
	public bootstrap(editService: BasicInfoPaymentsAndPoliciesEditService) {
		this._editService = editService;
	}

	public save(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			this._editService.savePaymentsAndPolicies().subscribe((result: any) => {
				resolve(true);
			}, (error: any) => {
				reject(error);
			});
		});
	}
	public getComponentName(): string {
		return "WizardBasicInfoPaymentsAndPoliciesComponent";
	}
}