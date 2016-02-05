export interface IMongoPatchApplier {
	apply(): Promise<any>;
	getPatchName(): string;
}