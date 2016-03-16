require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {TestUtils} from '../../../../test/helpers/TestUtils';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {YieldManagerFilterTestHelper} from './helpers/YieldManagerFilterTestHelper';
import {YieldManagerFilterConfigurationDO} from '../../../../core/data-layer/hotel-configurations/data-objects/yield-manager-filter/YieldManagerFilterConfigurationDO';
import {YieldManagerFilterValueDO} from '../../../../core/data-layer/common/data-objects/yield-manager-filter/YieldManagerFilterValueDO';
import {YieldManagerFilterDO, YieldManagerFilterType} from '../../../../core/data-layer/common/data-objects/yield-manager-filter/YieldManagerFilterDO';
import {HotelConfigurationType, HotelConfigurationMetadataDO} from '../../../../core/data-layer/hotel-configurations/data-objects/common/HotelConfigurationMetadataDO';
import {HotelConfigurationDO} from '../../../../core/data-layer/hotel-configurations/data-objects/HotelConfigurationDO';

describe("Yield Manager Filter Tests", function() {
    var testUtils: TestUtils;
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var yieldManagerFiltersHelper: YieldManagerFilterTestHelper;

    before(function(done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        testDataBuilder.buildWithDoneCallback(done);
        yieldManagerFiltersHelper = new YieldManagerFilterTestHelper(testDataBuilder);
    });

    describe("Yield Manager Filter Update Filters Flow", function() {
        it("Read the yield manager configuration for the hotel after init", function(done) {
            var hotelConfigRepo = testContext.appContext.getRepositoryFactory().getHotelConfigurationsRepository();
            hotelConfigRepo.getYieldManagerFilterConfiguration({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((config: YieldManagerFilterConfigurationDO) => {
                should.equal(testDataBuilder.defaultYieldManagerFilters.length, config.value.length);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

    });
});