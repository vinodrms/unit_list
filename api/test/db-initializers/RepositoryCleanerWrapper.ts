import {ThError} from '../../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../../core/utils/th-responses/ThResponse';
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
	public cleanRepositoryAsync(cleanRepoCallback: { (err: any, result?: boolean): void }) {
		this.cleanRepository().then((result: boolean) => {
			cleanRepoCallback(null, result);
		}).catch((error: any) => {
			cleanRepoCallback(error);
		});
	}
	public cleanRepository(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			var repositoryIndex = 0;
			async.whilst(
				(() => {
					return repositoryIndex < this._repositories.length;
				}),
				((finishInitSingleRepositoryCallback: any) => {
					var repository: IRepositoryCleaner = this._repositories[repositoryIndex++];
					repository.cleanRepository().then((result: any) => {
						finishInitSingleRepositoryCallback(null, result);
					}).catch((err: any) => {
						finishInitSingleRepositoryCallback(err);
					});
				}),
				((err: any) => {
					if (err) {
						var thError = new ThError(ThStatusCode.ErrorCleaningRepositories, err);
						reject(err);
					}
					else {
						resolve(null);
					}
				})
			);
		});
	}
}