export interface IMongoPatchApplier {
	apply(): Promise<any>;
}