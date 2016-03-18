require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {TestUtils} from '../../../../test/helpers/TestUtils';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {YieldFilterTestHelper} from './helpers/YieldFilterTestHelper';
import {YieldFilterConfigurationDO} from '../../../../core/data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';
import {YieldFilterValueDO} from '../../../../core/data-layer/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFilterDO, YieldFilterType} from '../../../../core/data-layer/common/data-objects/yield-filter/YieldFilterDO';
import {HotelConfigurationType, HotelConfigurationMetadataDO} from '../../../../core/data-layer/hotel-configurations/data-objects/common/HotelConfigurationMetadataDO';
import {HotelConfigurationDO} from '../../../../core/data-layer/hotel-configurations/data-objects/HotelConfigurationDO';
import {SaveYieldFilterValueDO} from '../../../../core/domain-layer/hotel-configurations/yield-filter/SaveYieldFilterValueDO';
import {SaveYieldFilterValue} from '../../../../core/domain-layer/hotel-configurations/yield-filter/SaveYieldFilterValue';

describe("Yield Filter Tests", function() {
    var testUtils: TestUtils;
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var yieldFiltersHelper: YieldFilterTestHelper;

    var updatedYieldConfigurations: YieldFilterConfigurationDO;

    before(function(done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        testDataBuilder.buildWithDoneCallback(done);
        yieldFiltersHelper = new YieldFilterTestHelper(testDataBuilder);
    });

    describe("Yield Filter Update Filters Flow", function() {
        it("Read the yield configuration for the hotel after init", function(done) {
            var hotelConfigRepo = testContext.appContext.getRepositoryFactory().getYieldFilterConfigurationsRepository();
            hotelConfigRepo.getYieldFilterConfiguration({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((config: YieldFilterConfigurationDO) => {
                should.equal(testDataBuilder.defaultYieldFilters.length, config.value.length);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should add a new filter value to the hotel's yield text filter", function(done) {
            var saveYieldFilterValueDO: SaveYieldFilterValueDO = yieldFiltersHelper.getValidTextYieldFilterValueDO();
            var saveYieldFilterValue = new SaveYieldFilterValue(testContext.appContext, testContext.sessionContext);

            saveYieldFilterValue.save(saveYieldFilterValueDO).then((yieldConfig: YieldFilterConfigurationDO) => {
                var yieldFilter: YieldFilterDO = _.findWhere(yieldConfig.value, { id: saveYieldFilterValueDO.filterId });
                var yieldValue: YieldFilterValueDO = _.last(yieldFilter.values);
                
                should.equal(yieldValue.label, saveYieldFilterValueDO.label);
                should.equal(yieldValue.description, saveYieldFilterValueDO.description);
                should.exist(yieldValue.id);
                
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should add a new filter value to the hotel's yield color filter", function(done) {
            var saveYieldFilterValueDO: SaveYieldFilterValueDO = yieldFiltersHelper.getValidColorYieldFilterValueDO();
            var saveYieldFilterValue = new SaveYieldFilterValue(testContext.appContext, testContext.sessionContext);

            saveYieldFilterValue.save(saveYieldFilterValueDO).then((yieldConfig: YieldFilterConfigurationDO) => {
                var yieldFilter: YieldFilterDO = _.findWhere(yieldConfig.value, { id: saveYieldFilterValueDO.filterId });
                var yieldValue: YieldFilterValueDO = _.last(yieldFilter.values);
                
                should.equal(yieldValue.colorCode, saveYieldFilterValueDO.colorCode);
                should.equal(yieldValue.description, saveYieldFilterValueDO.description);
                should.exist(yieldValue.id);
                
                updatedYieldConfigurations = yieldConfig;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should not add an invalid text filter value to the hotel's yield text filter", function(done) {
            var saveYieldFilterValueDO: SaveYieldFilterValueDO = yieldFiltersHelper.getInvalidTextYieldFilterValueDO();
            var saveYieldFilterValue = new SaveYieldFilterValue(testContext.appContext, testContext.sessionContext);

            saveYieldFilterValue.save(saveYieldFilterValueDO).then((yieldConfig: YieldFilterConfigurationDO) => {
                done(new Error("did manage to add an invalid text filter value to the hotel's yield text filter"));
            }).catch((error: any) => {
                done();
            });
        });

        it("Should not add an invalid color filter value to the hotel's yield color filter", function(done) {
            var saveYieldFilterValueDO: SaveYieldFilterValueDO = yieldFiltersHelper.getInvalidColorYieldFilterValueDO();
            var saveYieldFilterValue = new SaveYieldFilterValue(testContext.appContext, testContext.sessionContext);

            saveYieldFilterValue.save(saveYieldFilterValueDO).then((yieldConfig: YieldFilterConfigurationDO) => {
                done(new Error("did manage to add an invalid color filter value to the hotel's yield color filter"));
            }).catch((error: any) => {
                done();
            });
        });

        it("Should update a text filter value", function(done) {
            var saveYieldFilterValueDO: SaveYieldFilterValueDO = yieldFiltersHelper.getTextSaveYieldFilterValueDOFrom(updatedYieldConfigurations);
            saveYieldFilterValueDO.label = '6';
            saveYieldFilterValueDO.description = 'Seventh filter';
            var saveYieldFilterValue = new SaveYieldFilterValue(testContext.appContext, testContext.sessionContext);
            saveYieldFilterValue.save(saveYieldFilterValueDO).then((yieldConfig: YieldFilterConfigurationDO) => {
                var yieldFilter: YieldFilterDO = _.findWhere(yieldConfig.value, { id: saveYieldFilterValueDO.filterId });
                var yieldValue: YieldFilterValueDO = _.findWhere(yieldFilter.values, { id: saveYieldFilterValueDO["id"] });
                
                should.equal(yieldValue.label, saveYieldFilterValueDO.label);
                should.equal(yieldValue.description, saveYieldFilterValueDO.description);
                
                updatedYieldConfigurations = yieldConfig;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should update a color filter value", function(done) {
            var saveYieldFilterValueDO: SaveYieldFilterValueDO = yieldFiltersHelper.getColorSaveYieldFilterValueDOFrom(updatedYieldConfigurations);
            saveYieldFilterValueDO.colorCode = 'pinkie';
            saveYieldFilterValueDO.description = 'Pinkie filter';
            var saveYieldFilterValue = new SaveYieldFilterValue(testContext.appContext, testContext.sessionContext);
            saveYieldFilterValue.save(saveYieldFilterValueDO).then((yieldConfig: YieldFilterConfigurationDO) => {
                
                var yieldFilter: YieldFilterDO = _.findWhere(yieldConfig.value, { id: saveYieldFilterValueDO.filterId });
                var yieldValue: YieldFilterValueDO = _.findWhere(yieldFilter.values, { id: saveYieldFilterValueDO["id"] });
                
                should.equal(yieldValue.colorCode, saveYieldFilterValueDO.colorCode);
                should.equal(yieldValue.description, saveYieldFilterValueDO.description);
                
                updatedYieldConfigurations = yieldConfig;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should not update a text filter value with an existing label", function(done) {
            var saveYieldFilterValueDO: SaveYieldFilterValueDO = yieldFiltersHelper.getTextSaveYieldFilterValueDOFrom(updatedYieldConfigurations);
            var saveYieldFilterValue = new SaveYieldFilterValue(testContext.appContext, testContext.sessionContext);
            saveYieldFilterValue.save(saveYieldFilterValueDO).then((yieldConfig: YieldFilterConfigurationDO) => {
                done(new Error("Managed to update a text filter value with an existing label"));
            }).catch((error: any) => {
                done();
            });
        });

        it("Should not update a color filter value with an existing colorCode", function(done) {
            var saveYieldFilterValueDO: SaveYieldFilterValueDO = yieldFiltersHelper.getColorSaveYieldFilterValueDOFrom(updatedYieldConfigurations);
            var saveYieldFilterValue = new SaveYieldFilterValue(testContext.appContext, testContext.sessionContext);
            saveYieldFilterValue.save(saveYieldFilterValueDO).then((yieldConfig: YieldFilterConfigurationDO) => {
                done(new Error("Managed to update a color filter value with an existing colorCode"));
            }).catch((error: any) => {
                done();
            });
        });
    });
});