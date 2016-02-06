export interface IRepositoryCleaner {
	cleanRepository(): Promise<Object>;
}