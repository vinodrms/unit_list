export interface IBasicInfoStep {
	stepIndex: number;
	save(): Promise<any>;
	getComponentPath(): string;
}