import {RepositoryCleanerWrapper} from '../db-initializers/RepositoryCleanerWrapper';
import {UnitPalConfig} from '../../core/utils/environment/UnitPalConfig';

require("sails-test-helper");

before(function(done: any) {
	var unitPalConfig = new UnitPalConfig();
	var repositoryCleaner = new RepositoryCleanerWrapper(unitPalConfig);
    repositoryCleaner.cleanRepository().then((result: any) => {
        done();
    }).catch((err: Error) => {
        done(err.message);
    });
});