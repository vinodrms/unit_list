import {IBasicInfoStep} from './IBasicInfoStep';

export class WizardBasicInformationController {
	private _basicInfoStepIndex: number;

	constructor(private _basicInfoStepList: IBasicInfoStep[]) {
		this._basicInfoStepIndex = 0;
		this.updateBasicInfoStateIndexes();
	}
	private updateBasicInfoStateIndexes() {
		for (var index = 0; index < this._basicInfoStepList.length; index++) {
			this._basicInfoStepList[index].stepIndex = index;
		}
	}

	public bootstrapBasicInfoStepIndex(newIndex) {
		this._basicInfoStepIndex = newIndex;
	}

	public isLastBasicInformationStep(): boolean {
		return this._basicInfoStepIndex === this._basicInfoStepList.length - 1;
	}
	public isFirstBasicInformationStep(): boolean {
		return this._basicInfoStepIndex === 0;
	}
	public getCurrentBasicInformationStep(): IBasicInfoStep {
		return this._basicInfoStepList[this._basicInfoStepIndex];
	}
	public updateBasicInfoStepIndexWithOffset(offset: number) {
		this._basicInfoStepIndex += offset;
	}
}