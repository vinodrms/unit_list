require("sails-test-helper");
import should = require('should');

import {TestContext} from '../../../helpers/TestContext';
import {ITimeZonesService, TimeZoneDO} from '../../../../core/services/time-zones/ITimeZonesService';

describe("Time Zones Integration Tests", function() {
    const numTimeZones = 586;
    
    var testContext: TestContext;
    var timeZonesService: ITimeZonesService;

    before(function(done: any) {
        testContext = new TestContext();
        timeZonesService = testContext.appContext.getServiceFactory().getTimeZonesService();
        done();
    });

    describe("Get all available time zones", function() {
        it("Should get all available time zones", function(done) {
            timeZonesService.getAllAvailableTimeZones().then((result: TimeZoneDO[]) => {
                should.equal(result.length, numTimeZones);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
    });
});