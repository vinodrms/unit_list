import {Injectable} from '@angular/core';
import {IBasicInfoStep} from '../../../main/services/IBasicInfoStep';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {BasicInfoPropertyDetailsEditService} from '../../../../../../../common/basic-info/property-details/main/services/BasicInfoPropertyDetailsEditService';

@Injectable()
export class WizardBasicInfoPropertyDetailsService implements IBasicInfoStep {
	private _editService: BasicInfoPropertyDetailsEditService;

	stepIndex: number;
	constructor() {
	}
	public bootstrap(editService: BasicInfoPropertyDetailsEditService) {
		this._editService = editService;
	}

	public save(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			this._editService.savePropertyDetails().subscribe((result: any) => {
				resolve(true);
			}, (error: any) => {
				reject(error);
			});
		});
	}
	public getComponentPath(): string {
		return "property-details";
	}
}