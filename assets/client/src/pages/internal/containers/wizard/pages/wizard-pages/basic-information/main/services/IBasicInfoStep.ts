export interface IBasicInfoStep {
	stepIndex: number;
	save(): Promise<any>;
	getComponentName(): string;
}