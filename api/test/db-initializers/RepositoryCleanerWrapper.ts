import {ThError} from '../../core/utils/th-responses/ThError';
import {IRepositoryCleaner} from '../../core/data-layer/common/base/IRepositoryCleaner';
import {RepositoryFactory} from '../../core/data-layer/RepositoryFactory';
import {UnitPalConfig} from '../../core/utils/environment/UnitPalConfig';

export class RepositoryCleanerWrapper implements IRepositoryCleaner {
	private _repositories: IRepositoryCleaner[];
	constructor(private _unitPalConfig: UnitPalConfig) {
		this.initRepositories();
	}
	private initRepositories() {
		var repoFactory = new RepositoryFactory(this._unitPalConfig);
		this._repositories = repoFactory.getRepositoryCleaners();
	}
	public cleanRepository(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.cleanRepositoryCore(resolve, reject);
		});
	}
	private cleanRepositoryCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		var repoCleanersPromiseList: Promise<Object>[] = [];
		this._repositories.forEach((repository: IRepositoryCleaner) => {
			repoCleanersPromiseList.push(repository.cleanRepository());
		});
		Promise.all(repoCleanersPromiseList).then((results: Object[]) => {
			resolve(true);
		}).catch((error: any) => {
			reject(error);
		});
	}
}