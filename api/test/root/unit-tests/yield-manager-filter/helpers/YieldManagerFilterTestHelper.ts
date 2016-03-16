import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../../helpers/TestUtils';

import should = require('should');
import _ = require('underscore');

export class YieldManagerFilterTestHelper {
    private _testUtils: TestUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._testUtils = new TestUtils();
    }

}