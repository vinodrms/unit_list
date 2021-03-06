import {Injectable} from '@angular/core';
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
	public getComponentPath(): string {
		return "intro";
	}
}