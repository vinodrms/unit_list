import {Injectable} from 'angular2/core';
import {IBasicInfoStep} from '../../../main/services/IBasicInfoStep';

@Injectable()
export class WizardBasicInfoIntroService implements IBasicInfoStep {
	stepIndex: number;
	
	constructor() { }

	public save(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			resolve(true);
		});
	}
	public getComponentName(): string {
		return "WizardBasicInfoIntroComponent";
	}
}