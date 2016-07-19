require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {TestUtils} from '../../../../helpers/TestUtils';
import {RoomDO, RoomMaintenanceStatus} from '../../../../../core/data-layer/rooms/data-objects/RoomDO';
import {ChangeRoomMaintenanceStatus} from '../../../../../core/domain-layer/hotel-operations/room/change-maintenance-status/ChangeRoomMaintenanceStatus';
import {ChangeRoomMaintenanceStatusDO} from '../../../../../core/domain-layer/hotel-operations/room/change-maintenance-status/ChangeRoomMaintenanceStatusDO';

describe("Hotel Room Operations Tests", function () {
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var testUtils: TestUtils;

    before(function (done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        testDataBuilder.buildWithDoneCallback(done);
    });

    describe("Room Status Tests", function () {
        it("Should change the maintenance status of a room", function (done) {
            var room = testUtils.getRandomListElement(testDataBuilder.roomList);
            var roomToUpdate = new ChangeRoomMaintenanceStatusDO();
            roomToUpdate.id = room.id;
            roomToUpdate.maintenanceStatus = RoomMaintenanceStatus.PickUp;
            roomToUpdate.maintenanceMessage = "sabndhsab adhsgjdfasj d";

            var changeMaintenanceStatus = new ChangeRoomMaintenanceStatus(testContext.appContext, testContext.sessionContext);
            changeMaintenanceStatus.changeStatus(roomToUpdate).then((updatedRoom: RoomDO) => {
                should.equal(updatedRoom.maintenanceStatus, RoomMaintenanceStatus.PickUp);
                should.equal(updatedRoom.maintenanceMessage, "sabndhsab adhsgjdfasj d");
                should.equal(updatedRoom.maintenanceHistory.actionList.length > 0, true);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
    });
});