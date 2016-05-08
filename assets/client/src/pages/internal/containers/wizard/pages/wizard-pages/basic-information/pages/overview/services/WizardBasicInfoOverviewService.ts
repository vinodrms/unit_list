import {Injectable} from '@angular/core';
import {IBasicInfoStep} from '../../../main/services/IBasicInfoStep';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {BasicInfoOverviewEditService} from '../../../../../../../common/basic-info/overview/main/services/BasicInfoOverviewEditService';

@Injectable()
export class WizardBasicInfoOverviewService implements IBasicInfoStep {
	private _editService: BasicInfoOverviewEditService;

	stepIndex: number;
	constructor() {
	}
	public bootstrap(editService: BasicInfoOverviewEditService) {
		this._editService = editService;
	}

	public save(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			this._editService.saveOverview().subscribe((result: any) => {
				resolve(true);
			}, (error: any) => {
				reject(error);
			});
		});
	}
	public getComponentName(): string {
		return "WizardBasicInfoOverviewComponent";
	}
}