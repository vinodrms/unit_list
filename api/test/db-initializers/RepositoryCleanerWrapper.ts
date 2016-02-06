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
	cleanRepository(): Promise<Object> {
		return new Promise<Object>((resolve, reject) => {
			var repositoryIndex = 0;
			async.whilst(
				(() => {
					return repositoryIndex < this._repositories.length;
				}),
				((finishInitSingleRepositoryCallback: any) => {
					var repository: IRepositoryCleaner = this._repositories[repositoryIndex++];
					repository.cleanRepository().then((result: any) => {
						finishInitSingleRepositoryCallback(null, result);
					}).catch((err: Error) => {
						finishInitSingleRepositoryCallback(err);
					});
				}),
				((err: Error) => {
					if (err) {
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